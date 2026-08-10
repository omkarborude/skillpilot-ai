import type { AIPlanProvider, CoachContext } from './aiProvider';
import type { LearnerGoal, LearningPlan, ReplacementMode, Technique } from '@/types/learning';

type ApiEnvelope<T> = {
  data: T;
  meta: {
    requestId: string;
    provider: string;
    fallbackUsed: boolean;
  };
};

type ApiErrorEnvelope = {
  error?: {
    code?: string;
    message?: string;
    requestId?: string;
  };
};

function assertPlan(value: unknown): asserts value is LearningPlan {
  if (!value || typeof value !== 'object') throw new Error('API returned an invalid plan');
  const candidate = value as Partial<LearningPlan>;
  if (!candidate.id || !Array.isArray(candidate.techniques) || candidate.techniques.length < 5) {
    throw new Error('API returned an invalid plan');
  }
}

export class HttpAIProvider implements AIPlanProvider {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const payload = (await response.json()) as ApiEnvelope<T> & ApiErrorEnvelope;

      if (!response.ok) {
        const requestId = payload.error?.requestId ? ` (${payload.error.requestId})` : '';
        throw new Error(`${payload.error?.message ?? 'SkillPilot API request failed'}${requestId}`);
      }
      if (payload.meta?.fallbackUsed || payload.meta?.provider !== 'gemini') {
        throw new Error('The learning service did not return a live Gemini response. Please retry.');
      }
      return payload.data;
    } finally {
      clearTimeout(timeout);
    }
  }

  async generatePlan(goal: LearnerGoal): Promise<LearningPlan> {
    const plan = await this.post<LearningPlan>('/api/v1/plans/generate', { goal });
    assertPlan(plan);
    return plan;
  }

  async answerCoach(prompt: string, context: CoachContext): Promise<string> {
    const result = await this.post<{ answer: string }>('/api/v1/coach/respond', {
      prompt,
      goal: context.goal,
      technique: context.technique,
      journeyProgress: context.journeyProgress,
      recentMessages: context.recentMessages.slice(-8).map(({ role, content }) => ({ role, content })),
    });
    if (!result.answer?.trim()) throw new Error('API returned an empty coach response');
    return result.answer;
  }

  replaceTechnique(technique: Technique, mode: ReplacementMode, goal: LearnerGoal): Promise<Technique> {
    return this.post<Technique>('/api/v1/techniques/replace', { technique, mode, goal });
  }
}
