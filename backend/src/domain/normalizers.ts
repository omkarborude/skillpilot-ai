import {
  LearningPlanSchema,
  type LearnerGoal,
  type LearningPlan,
  type PlanDraft,
  type Technique,
  type TechniqueDraft,
} from '../contracts.js';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

function normalizeResourceType(
  hobbyId: LearnerGoal['hobbyId'],
  type: TechniqueDraft['resources'][number]['type'],
) {
  // Audio is valuable for sound/rhythm learning. It is a poor default for the
  // other MVP hobbies, particularly chess, so convert accidental AI choices.
  if (type === 'audio' && hobbyId !== 'guitar') return 'article' as const;
  return type;
}

export function normalizeTechniqueDraft(
  goal: LearnerGoal,
  draft: TechniqueDraft,
  order: number,
): Technique {
  const baseId = `${goal.hobbyId}-${order}-${slugify(draft.shortTitle || draft.title)}`;

  return {
    ...draft,
    id: baseId,
    order,
    minutes: Math.min(goal.dailyMinutes, draft.minutes),
    status: order === 1 ? 'in_progress' : 'locked',
    resources: draft.resources.map((resource, index) => ({
      ...resource,
      id: `${baseId}-resource-${index + 1}`,
      type: normalizeResourceType(goal.hobbyId, resource.type),
    })),
    practiceTasks: draft.practiceTasks.map((label, index) => ({
      id: `${baseId}-task-${index + 1}`,
      label,
    })),
  };
}

export function normalizePlanDraft(goal: LearnerGoal, draft: PlanDraft): LearningPlan {
  return LearningPlanSchema.parse({
    id: `${goal.hobbyId}-${slugify(draft.title)}`,
    hobbyId: goal.hobbyId,
    title: draft.title,
    outcome: draft.outcome,
    totalWeeks: draft.totalWeeks,
    techniques: draft.techniques.map((technique, index) =>
      normalizeTechniqueDraft(goal, technique, index + 1),
    ),
  });
}

export function normalizeReplacement(
  goal: LearnerGoal,
  original: Technique,
  draft: TechniqueDraft,
): Technique {
  const normalized = normalizeTechniqueDraft(goal, draft, original.order);
  return {
    ...normalized,
    id: original.id,
    order: original.order,
    status: original.status,
    replaced: true,
  };
}
