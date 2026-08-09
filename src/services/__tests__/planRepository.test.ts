import { describe, expect, it } from '@jest/globals';
import { planRepository } from '../planRepository';

describe('LocalPlanRepository', () => {
  it('returns a fresh seven-technique guitar plan', async () => {
    const goal = {
      hobbyId: 'guitar' as const,
      hobbyName: 'Guitar',
      reason: 'confidence' as const,
      level: 'beginner' as const,
      dailyMinutes: 20,
    };

    const first = await planRepository.getTemplate(goal);
    const second = await planRepository.getTemplate(goal);

    expect(first.techniques).toHaveLength(7);
    expect(first.techniques.filter(({ status }) => status === 'completed')).toHaveLength(3);
    first.techniques[0]!.title = 'Mutated title';
    expect(second.techniques[0]?.title).not.toBe('Mutated title');
  });

  it('uses reading and practice rather than audio-first learning for chess', async () => {
    const plan = await planRepository.getTemplate({
      hobbyId: 'chess',
      hobbyName: 'Chess',
      reason: 'fun',
      level: 'beginner',
      dailyMinutes: 15,
    });

    expect(plan.techniques).toHaveLength(6);
    expect(plan.techniques.flatMap(({ resources }) => resources).some(({ type }) => type === 'audio')).toBe(false);
    expect(plan.techniques[0]?.status).toBe('in_progress');
  });
});
