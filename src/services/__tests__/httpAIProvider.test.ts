import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { HttpAIProvider } from '@/services/httpAIProvider';
import { planRepository } from '@/services/planRepository';
import type { LearnerGoal } from '@/types/learning';

const goal: LearnerGoal = {
  hobbyId: 'guitar',
  hobbyName: 'Guitar',
  reason: 'perform',
  level: 'beginner',
  dailyMinutes: 20,
};

describe('HttpAIProvider', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('maps the versioned API response to the frontend contract', async () => {
    const plan = await planRepository.getTemplate(goal);
    const fetchMock = jest.fn<typeof fetch>().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: plan,
        meta: { requestId: 'request-123', provider: 'mock', fallbackUsed: false },
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
    } as Response) as unknown as typeof fetch;

    const provider = new HttpAIProvider('https://skillpilot-api.vercel.app');
    await expect(provider.generatePlan(goal)).rejects.toThrow('request-456');
  });
});
