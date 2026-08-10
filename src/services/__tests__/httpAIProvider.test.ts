import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { HttpAIProvider } from '@/services/httpAIProvider';
import type { LearnerGoal, LearningPlan } from '@/types/learning';

const goal: LearnerGoal = {
  hobbyId: 'guitar',
  hobbyName: 'Guitar',
  reason: 'perform',
  level: 'beginner',
  dailyMinutes: 20,
};

const plan = {
  id: 'generated-plan',
  hobbyId: 'guitar',
  title: 'Generated guitar plan',
  outcome: 'Play a complete song with steady timing.',
  totalWeeks: 4,
  techniques: Array.from({ length: 5 }, (_, index) => ({ id: `technique-${index + 1}` })),
} as LearningPlan;

describe('HttpAIProvider', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('maps the versioned API response to the frontend contract', async () => {
    const fetchMock = jest.fn<typeof fetch>().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: plan,
        meta: { requestId: 'request-123', provider: 'gemini', fallbackUsed: false },
      }),
    } as Response);
    global.fetch = fetchMock as unknown as typeof fetch;

    const provider = new HttpAIProvider('https://skillpilot-api.vercel.app/');
    await expect(provider.generatePlan(goal)).resolves.toEqual(plan);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://skillpilot-api.vercel.app/api/v1/plans/generate',
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ goal }) }),
    );
  });

  it('surfaces the API request id when a request fails', async () => {
    global.fetch = jest.fn<typeof fetch>().mockResolvedValue({
      ok: false,
      json: async () => ({
        error: { message: 'Request body is invalid', requestId: 'request-456' },
      }),
    } as unknown as Response) as unknown as typeof fetch;

    const provider = new HttpAIProvider('https://skillpilot-api.vercel.app');
    await expect(provider.generatePlan(goal)).rejects.toThrow('request-456');
  });

  it('rejects server fallback content instead of presenting fabricated data', async () => {
    global.fetch = jest.fn<typeof fetch>().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: plan,
        meta: { requestId: 'request-789', provider: 'mock', fallbackUsed: true },
      }),
    } as Response) as unknown as typeof fetch;

    const provider = new HttpAIProvider('https://skillpilot-api.vercel.app');
    await expect(provider.generatePlan(goal)).rejects.toThrow('live Gemini response');
  });

  it('returns a useful error when the service response is not JSON', async () => {
    global.fetch = jest.fn<typeof fetch>().mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => { throw new SyntaxError('Unexpected token'); },
    } as unknown as Response) as unknown as typeof fetch;

    const provider = new HttpAIProvider('https://skillpilot-api.onrender.com');
    await expect(provider.generatePlan(goal)).rejects.toThrow('Learning service returned 502');
  });

  it('returns a useful error when a request times out', async () => {
    const abortError = new Error('aborted');
    abortError.name = 'AbortError';
    global.fetch = jest.fn<typeof fetch>().mockRejectedValue(abortError) as unknown as typeof fetch;

    const provider = new HttpAIProvider('https://skillpilot-api.onrender.com');
    await expect(provider.generatePlan(goal)).rejects.toThrow('learning service timed out');
  });
});
