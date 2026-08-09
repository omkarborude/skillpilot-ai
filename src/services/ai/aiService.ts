import { z } from 'zod';
import type { AppState, Technique } from '../../types/learning';

const CoachResponseSchema = z.object({
  title: z.string(),
  message: z.string(),
  nextStep: z.string(),
});

export type CoachResponse = z.infer<typeof CoachResponseSchema>;

export interface AIProvider {
  coach(prompt: string, state: AppState, technique: Technique): Promise<CoachResponse>;
  reflect(technique: Technique): Promise<string>;
}

export class MockAIProvider implements AIProvider {
  async coach(prompt: string, state: AppState, technique: Technique) {
    return CoachResponseSchema.parse({
      title: prompt,
      message: `For ${technique.title}, stay focused on ${state.goal.goal.toLowerCase()}. Keep the next rep small, slow, and repeatable before adding speed.`,
      nextStep: `Practice ${technique.checklist[0]} for five minutes, then write one short note about what felt easier.`,
    });
  }

  async reflect(technique: Technique) {
    return `Nice work completing ${technique.title}. The next improvement will come from shorter, more frequent sessions.`;
  }
}

export class AIService {
  constructor(private readonly provider: AIProvider = new MockAIProvider()) {}

  coach(prompt: string, state: AppState, technique: Technique) {
    return this.provider.coach(prompt, state, technique);
  }

  reflect(technique: Technique) {
    return this.provider.reflect(technique);
  }
}

export const aiService = new AIService();
