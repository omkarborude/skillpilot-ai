import AsyncStorage from '@react-native-async-storage/async-storage';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { migrateJourneyState, useJourneyStore } from '@/store/journeyStore';
import type { LearningPlan, Technique } from '@/types/learning';

function technique(id: string, status: Technique['status'], order: number): Technique {
  return {
    id,
    order,
    title: `${id} technique`,
    shortTitle: id,
    description: `Practice the ${id} technique with deliberate repetitions.`,
    whyItMatters: `The ${id} technique supports the next part of the plan.`,
    minutes: 10,
    status,
    resources: [{ id: `${id}-practice`, type: 'practice', description: 'Use the guided timer and checklist for this technique.' }],
    practiceTasks: [
      { id: `${id}-task-1`, label: 'Complete the first cue' },
      { id: `${id}-task-2`, label: 'Complete the second cue' },
    ],
    keyPoints: ['Move slowly first', 'Check one result'],
  };
}

const plan: LearningPlan = {
  id: 'persisted-plan',
  hobbyId: 'guitar',
  title: 'Persisted guitar plan',
  outcome: 'Play a short song with steady chord changes.',
  totalWeeks: 3,
  techniques: [
    technique('first', 'completed', 1),
    technique('second', 'skipped', 2),
    technique('third', 'in_progress', 3),
    technique('fourth', 'locked', 4),
    technique('fifth', 'locked', 5),
  ],
};

describe('journey persistence', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useJourneyStore.setState({
      goal: null,
      plan: null,
      practiceMinutes: 0,
      streakDays: 0,
      xp: 0,
      practiceSessions: [],
      coachMessages: [],
    });
  });

  it('restores completed and skipped progress from device storage', async () => {
    useJourneyStore.getState().setPlan(plan);
    useJourneyStore.getState().recordPractice(8, 'first');
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    const persistedJourney = await AsyncStorage.getItem('skillpilot-journey-v1');
    expect(persistedJourney).not.toBeNull();

    useJourneyStore.setState({ plan: null, practiceMinutes: 0, practiceSessions: [] });
    await AsyncStorage.setItem('skillpilot-journey-v1', persistedJourney!);
    await useJourneyStore.persist.rehydrate();

    expect(useJourneyStore.getState().plan?.techniques.map(({ status }) => status)).toEqual([
      'completed',
      'skipped',
      'in_progress',
      'locked',
      'locked',
    ]);
    expect(useJourneyStore.getState()).toMatchObject({ practiceMinutes: 8 });
    expect(useJourneyStore.getState().practiceSessions).toHaveLength(1);
  });

  it('preserves progress while converting older resource metadata to a search recommendation', () => {
    const legacyPlan = structuredClone(plan) as LearningPlan;
    legacyPlan.techniques[0]!.resources = [{
      id: 'legacy-video',
      type: 'video',
      title: 'Smooth chord changes',
      durationLabel: '8 min',
      description: 'Watch a slow explanation of the movement.',
      url: 'https://example.com/unverified',
    } as unknown as Technique['resources'][number]];

    const migrated = migrateJourneyState({
      goal: {
        hobbyId: 'guitar',
        hobbyName: 'Guitar',
        reason: 'perform',
        level: 'beginner',
        dailyMinutes: 20,
      },
      plan: legacyPlan,
      practiceMinutes: 8,
      practiceSessions: [],
    }, 2);

    expect(migrated.plan?.techniques.map(({ status }) => status)).toEqual([
      'completed',
      'skipped',
      'in_progress',
      'locked',
      'locked',
    ]);
    expect(migrated.plan?.techniques[0]?.resources[0]).toEqual({
      id: 'legacy-video',
      type: 'video',
      searchQuery: 'Guitar Smooth chord changes',
      description: 'Watch a slow explanation of the movement.',
    });
    expect(migrated.practiceMinutes).toBe(8);
  });
});
