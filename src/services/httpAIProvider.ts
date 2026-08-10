import type { AIPlanProvider, CoachContext } from './aiProvider';
import type { LearnerGoal, LearningPlan, ReplacementMode, Technique } from '@/types/learning';
import { type z } from 'zod';
import {
  ApiErrorEnvelopeSchema,
  CoachResponseSchema,
  LearningPlanSchema,
  TechniqueSchema,
  apiEnvelopeSchema,
} from './apiSchemas';

export class HttpAIProvider implements AIPlanProvider {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private async post<T>(path: string, body: unknown, dataSchema: z.ZodType<T>): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        const errorPayload = ApiErrorEnvelopeSchema.safeParse(payload);
        const error = errorPayload.success ? errorPayload.data.error : undefined;
        const requestId = error?.requestId ? ` (${error.requestId})` : '';
        throw new Error(`${error?.message ?? 'SkillPilot API request failed'}${requestId}`);
      }

      const envelope = apiEnvelopeSchema(dataSchema).safeParse(payload);
      if (!envelope.success) throw new Error('API returned an invalid response');
      if (envelope.data.meta.fallbackUsed || envelope.data.meta.provider !== 'gemini') {
        throw new Error('The learning service did not return a live Gemini response. Please retry.');
      }
      return envelope.data.data;
    } finally {
      clearTimeout(timeout);
    }
  }

  async generatePlan(goal: LearnerGoal): Promise<LearningPlan> {
    return this.post('/api/v1/plans/generate', { goal }, LearningPlanSchema);
  }

  async answerCoach(prompt: string, context: CoachContext): Promise<string> {
    const result = await this.post('/api/v1/coach/respond', {
      prompt,
      goal: context.goal,
      technique: context.technique,
      journeyProgress: context.journeyProgress,
      recentMessages: context.recentMessages.slice(-8).map(({ role, content }) => ({ role, content })),
    }, CoachResponseSchema);
    return result.answer;
  }

  replaceTechnique(technique: Technique, mode: ReplacementMode, goal: LearnerGoal): Promise<Technique> {
    return this.post('/api/v1/techniques/replace', { technique, mode, goal }, TechniqueSchema);
  }
}
