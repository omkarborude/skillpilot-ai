import { describe, expect, it } from '@jest/globals';
import { LearningPlan, Technique } from '@/types/learning';
import {
  calculateJourneyProgress,
  calculateMasteryProgress,
  getActiveTechnique,
  replaceTechniqueInPlan,
  updateTechniqueStatus,
} from '../learning';

function technique(id: string, status: Technique['status'], order: number): Technique {
  return {
    id,
    order,
    title: id,
    shortTitle: id,
    description: `${id} description`,
    whyItMatters: `${id} matters`,
    minutes: 10,
    status,
    resources: [],
    practiceTasks: [],
    keyPoints: [],
  };
}

function planWith(...techniques: Technique[]): LearningPlan {
  return {
    id: 'test-plan',
    hobbyId: 'guitar',
    title: 'Test plan',
    outcome: 'Test outcome',
    totalWeeks: 2,
    techniques,
  };
}

describe('learning progress', () => {
  it('separates resolved journey progress from mastery', () => {
    const plan = planWith(
      technique('complete', 'completed', 1),
      technique('skip', 'skipped', 2),
      technique('active', 'in_progress', 3),
      technique('locked', 'locked', 4),
    );

    expect(calculateJourneyProgress(plan)).toBe(50);
    expect(calculateMasteryProgress(plan)).toBe(25);
  });

  it('returns safe progress for an empty plan', () => {
    expect(calculateJourneyProgress(null)).toBe(0);
    expect(calculateMasteryProgress(planWith())).toBe(0);
  });
});

describe('technique transitions', () => {
  it('unlocks the next technique when the active one is completed', () => {
    const original = planWith(
      technique('active', 'in_progress', 1),
      technique('next', 'locked', 2),
      technique('later', 'locked', 3),
    );

    const updated = updateTechniqueStatus(original, 'active', 'completed');

    expect(updated.techniques[0]?.status).toBe('completed');
    expect(updated.techniques[1]?.status).toBe('in_progress');
    expect(updated.techniques[2]?.status).toBe('locked');
    expect(getActiveTechnique(updated)?.id).toBe('next');
    expect(original.techniques[0]?.status).toBe('in_progress');
  });

  it('keeps the technique identity when AI replaces its route', () => {
    const original = planWith(technique('active', 'in_progress', 1));
    const replacement = { ...original.techniques[0]!, title: 'Simpler route', replaced: true };
    const updated = replaceTechniqueInPlan(original, replacement);

    expect(updated.techniques[0]).toMatchObject({ id: 'active', title: 'Simpler route', replaced: true });
  });
});
