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

  private async post<T>(path: string, body: unknown, timeoutMs = 60_000): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const payload = await response.json().catch(() => null) as (ApiEnvelope<T> & ApiErrorEnvelope) | null;

      if (!response.ok) {
        const requestId = payload?.error?.requestId ? ` (${payload.error.requestId})` : '';
        throw new Error(`${payload?.error?.message ?? `Learning service returned ${response.status}`}${requestId}`);
      }
      if (!payload) throw new Error('The learning service returned an invalid response.');
      if (payload.meta?.fallbackUsed || payload.meta?.provider !== 'gemini') {
        throw new Error('The learning service did not return a live Gemini response. Please retry.');
      }
      return payload.data;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('The learning service timed out. Please retry.');
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  async generatePlan(goal: LearnerGoal): Promise<LearningPlan> {
    const plan = await this.post<LearningPlan>('/api/v1/plans/generate', { goal }, 90_000);
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
    }, 30_000);
    if (!result.answer?.trim()) throw new Error('API returned an empty coach response');
    return result.answer;
  }

  replaceTechnique(technique: Technique, mode: ReplacementMode, goal: LearnerGoal): Promise<Technique> {
    return this.post<Technique>('/api/v1/techniques/replace', { technique, mode, goal });
  }
}
