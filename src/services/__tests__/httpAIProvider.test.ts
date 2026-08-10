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
  techniques: Array.from({ length: 5 }, (_, index) => ({
    id: `technique-${index + 1}`,
    order: index + 1,
    title: `Guitar technique ${index + 1}`,
    shortTitle: `Technique ${index + 1}`,
    description: 'Practice a clear chord change with slow, deliberate repetitions.',
    whyItMatters: 'This movement supports smoother transitions in the complete song.',
    minutes: 15,
    status: index === 0 ? 'in_progress' as const : 'locked' as const,
    resources: [
      {
        id: `resource-${index + 1}`,
        type: 'video' as const,
        searchQuery: 'beginner guitar chord changes slow demonstration',
        description: 'Look for a close camera angle and a slow demonstration.',
      },
      {
        id: `practice-${index + 1}`,
        type: 'practice' as const,
        description: 'Use the timer and checklist to apply this technique.',
      },
    ],
    practiceTasks: [
      { id: `task-${index + 1}-1`, label: 'Place each finger carefully' },
      { id: `task-${index + 1}-2`, label: 'Repeat the change five times' },
    ],
    keyPoints: ['Keep the hand relaxed', 'Move one finger at a time'],
  })),
} satisfies LearningPlan;

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

    const provider = new HttpAIProvider('https://skillpilot-api.onrender.com/');
    await expect(provider.generatePlan(goal)).resolves.toEqual(plan);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://skillpilot-api.onrender.com/api/v1/plans/generate',
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

    const provider = new HttpAIProvider('https://skillpilot-api.onrender.com');
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

    const provider = new HttpAIProvider('https://skillpilot-api.onrender.com');
    await expect(provider.generatePlan(goal)).rejects.toThrow('live Gemini response');
  });

  it('rejects a resource recommendation without a usable search query', async () => {
    const invalidPlan = structuredClone(plan);
    delete (invalidPlan.techniques[0]?.resources[0] as { searchQuery?: string }).searchQuery;
    global.fetch = jest.fn<typeof fetch>().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: invalidPlan,
        meta: { requestId: 'request-invalid-resource', provider: 'gemini', fallbackUsed: false },
      }),
    } as Response) as unknown as typeof fetch;

    const provider = new HttpAIProvider('https://skillpilot-api.onrender.com');
    await expect(provider.generatePlan(goal)).rejects.toThrow('invalid response');
  });
});
