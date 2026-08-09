import guitarPlanJson from '@/data/guitar-plan.json';
import { LearnerGoal, LearningPlan, LearningResource, Technique } from '@/types/learning';
import { clonePlan } from '@/utils/learning';

export interface PlanRepository {
  getTemplate(goal: LearnerGoal): Promise<LearningPlan>;
}

function assertPlan(value: unknown): asserts value is LearningPlan {
  if (!value || typeof value !== 'object') throw new Error('Plan data is missing');
  const candidate = value as Partial<LearningPlan>;
  if (!candidate.id || !candidate.title || !Array.isArray(candidate.techniques)) {
    throw new Error('Plan data has an invalid shape');
  }
}

const genericBlueprints: Record<Exclude<LearnerGoal['hobbyId'], 'guitar'>, string[]> = {
  chess: [
    'Board vision and safe pieces',
    'Opening principles that prevent mistakes',
    'Checks, captures, and threats',
    'Two tactical patterns',
    'A repeatable thinking routine',
    'Essential king-and-pawn endings',
  ],
  photography: [
    'Control light before settings',
    'Build stronger composition',
    'Freeze or show movement',
    'Use depth intentionally',
    'Create a consistent edit',
    'Finish a five-photo story',
  ],
  drawing: [
    'See shapes instead of objects',
    'Control confident lines',
    'Build form with light and shadow',
    'Use proportion checkpoints',
    'Create believable perspective',
    'Finish one expressive study',
  ],
  custom: [
    'Set up the essential foundation',
    'Learn one reliable core technique',
    'Connect technique to a real outcome',
    'Fix the most common beginner mistake',
    'Build a repeatable practice loop',
    'Complete a small personal milestone',
  ],
};

function genericResource(hobbyId: LearnerGoal['hobbyId'], order: number): LearningResource[] {
  const visualFirst = hobbyId === 'photography' || hobbyId === 'drawing';
  const thinkingFirst = hobbyId === 'chess';
  return [
    {
      id: `guide-${order}`,
      title: visualFirst ? 'Visual breakdown and examples' : 'Focused concept guide',
      type: visualFirst ? 'video' : thinkingFirst ? 'article' : 'video',
      durationLabel: '6 min',
      description: 'Only the explanation needed for this technique, with useful examples.',
    },
    {
      id: `practice-${order}`,
      title: 'Guided mini-practice',
      type: 'practice',
      durationLabel: '10 min',
      description: 'Apply the technique immediately and record one observation.',
    },
  ];
}

function createGenericPlan(goal: LearnerGoal): LearningPlan {
  const blueprintKey = goal.hobbyId === 'guitar' ? 'custom' : goal.hobbyId;
  const blueprints = genericBlueprints[blueprintKey];

  const techniques: Technique[] = blueprints.map((title, index) => ({
    id: `${goal.hobbyId}-technique-${index + 1}`,
    order: index + 1,
    title,
    shortTitle: title,
    description: `A focused step that moves you closer to your ${goal.hobbyName.toLowerCase()} goal.`,
    whyItMatters: 'This is a high-leverage technique, so you can make progress without learning everything.',
    minutes: Math.min(goal.dailyMinutes, index === blueprints.length - 1 ? 25 : 18),
    status: index === 0 ? 'in_progress' : 'locked',
    resources: genericResource(goal.hobbyId, index + 1),
    practiceTasks: [
      { id: `understand-${index}`, label: 'Review the focused example' },
      { id: `repeat-${index}`, label: 'Repeat the core action five times' },
      { id: `reflect-${index}`, label: 'Write down one thing to improve' },
    ],
    keyPoints: ['Keep the outcome small', 'Prefer feedback over repetition', 'Stop before practice becomes careless'],
  }));

  return {
    id: `${goal.hobbyId}-focused-plan`,
    hobbyId: goal.hobbyId,
    title: `${goal.hobbyName} Essentials`,
    outcome: `Build confidence through six focused ${goal.hobbyName.toLowerCase()} techniques.`,
    totalWeeks: 4,
    techniques,
  };
}

class LocalPlanRepository implements PlanRepository {
  async getTemplate(goal: LearnerGoal): Promise<LearningPlan> {
    if (goal.hobbyId !== 'guitar') return createGenericPlan(goal);

    assertPlan(guitarPlanJson);
    return clonePlan(guitarPlanJson);
  }
}

export const planRepository: PlanRepository = new LocalPlanRepository();
