import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import {
  PlanDraftSchema,
  TechniqueDraftSchema,
  type CoachRequest,
  type LearnerGoal,
  type ReplaceTechniqueRequest,
} from '../contracts.js';
import { ProviderError } from '../errors.js';
import { normalizePlanDraft, normalizeReplacement } from '../domain/normalizers.js';
import { buildCoachPrompt, buildPlanPrompt, buildReplacementPrompt } from '../prompts.js';
import type { LearningProvider } from './learning-provider.js';

type StructuredSchema = typeof PlanDraftSchema | typeof TechniqueDraftSchema;

const unsupportedGeminiSchemaKeys = new Set(['$schema', 'minLength', 'maxLength']);

export function sanitizeGeminiSchema(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeGeminiSchema);
  if (!value || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !unsupportedGeminiSchemaKeys.has(key))
      .map(([key, child]) => [key, sanitizeGeminiSchema(child)]),
  );
}

export class GeminiLearningProvider implements LearningProvider {
  readonly name = 'gemini' as const;
  private readonly client: GoogleGenAI;

  constructor(apiKey: string, private readonly model: string) {
    this.client = new GoogleGenAI({ apiKey });
  }

  private async generateStructured<T>(prompt: string, schema: StructuredSchema): Promise<T> {
    try {
      const interaction = await this.client.interactions.create(
        {
          model: this.model,
          input: prompt,
          store: false,
          response_format: {
            type: 'text',
            mime_type: 'application/json',
            schema: sanitizeGeminiSchema(
              z.toJSONSchema(schema, { target: 'draft-7' }),
            ) as Record<string, unknown>,
          },
        },
        { timeout: 45_000 },
      );

      if (!interaction.output_text) throw new ProviderError('Gemini returned an empty response');
      return schema.parse(JSON.parse(interaction.output_text)) as T;
    } catch (error) {
      if (error instanceof ProviderError) throw error;
      throw new ProviderError('Gemini did not return a valid learning response', { cause: error });
    }
  }

  async generatePlan(goal: LearnerGoal) {
    const draft = await this.generateStructured<z.infer<typeof PlanDraftSchema>>(
      buildPlanPrompt(goal),
      PlanDraftSchema,
    );
    return normalizePlanDraft(goal, draft);
  }

  async replaceTechnique(input: ReplaceTechniqueRequest) {
    const draft = await this.generateStructured<z.infer<typeof TechniqueDraftSchema>>(
      buildReplacementPrompt(input),
      TechniqueDraftSchema,
    );
    const goal: LearnerGoal =
      input.goal ?? {
        hobbyId: 'custom',
        hobbyName: 'Your hobby',
        customHobby: 'Your hobby',
        reason: 'fun',
        level: 'beginner',
        dailyMinutes: Math.max(10, input.technique.minutes),
      };
    return normalizeReplacement(goal, input.technique, draft);
  }

  async answerCoach(input: CoachRequest) {
    try {
      const interaction = await this.client.interactions.create(
        {
          model: this.model,
          input: buildCoachPrompt(input),
          store: false,
          system_instruction:
            'You are Nova, a concise hobby practice coach. Never claim to see or hear the learner.',
        },
        { timeout: 15_000 },
      );
      const answer = interaction.output_text?.trim();
      if (!answer) throw new ProviderError('Gemini returned an empty coach response');
      return answer;
    } catch (error) {
      if (error instanceof ProviderError) throw error;
      throw new ProviderError('Gemini coach request failed', { cause: error });
    }
  }
}
