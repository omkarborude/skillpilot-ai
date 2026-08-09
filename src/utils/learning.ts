import { LearningPlan, Technique, TechniqueStatus } from '@/types/learning';

export function clonePlan(plan: LearningPlan): LearningPlan {
  return JSON.parse(JSON.stringify(plan)) as LearningPlan;
}

export function calculateJourneyProgress(plan: LearningPlan | null): number {
  if (!plan || plan.techniques.length === 0) return 0;

  const resolved = plan.techniques.filter(
    ({ status }) => status === 'completed' || status === 'skipped',
  ).length;

  return Math.round((resolved / plan.techniques.length) * 100);
}

export function calculateMasteryProgress(plan: LearningPlan | null): number {
  if (!plan || plan.techniques.length === 0) return 0;

  const completed = plan.techniques.filter(({ status }) => status === 'completed').length;
  return Math.round((completed / plan.techniques.length) * 100);
}

export function getActiveTechnique(plan: LearningPlan | null): Technique | undefined {
  if (!plan) return undefined;
  return (
    plan.techniques.find(({ status }) => status === 'in_progress') ??
    plan.techniques.find(({ status }) => status === 'locked')
  );
}

export function updateTechniqueStatus(
  plan: LearningPlan,
  techniqueId: string,
  status: TechniqueStatus,
): LearningPlan {
  const index = plan.techniques.findIndex(({ id }) => id === techniqueId);
  if (index < 0) return plan;

  const techniques = plan.techniques.map((technique, techniqueIndex) => {
    if (techniqueIndex === index) return { ...technique, status };

    const shouldUnlockNext =
      techniqueIndex === index + 1 &&
      technique.status === 'locked' &&
      (status === 'completed' || status === 'skipped');

    return shouldUnlockNext ? { ...technique, status: 'in_progress' as const } : technique;
  });

  return { ...plan, techniques };
}

export function replaceTechniqueInPlan(plan: LearningPlan, replacement: Technique): LearningPlan {
  return {
    ...plan,
    techniques: plan.techniques.map((technique) =>
      technique.id === replacement.id ? replacement : technique,
    ),
  };
}

export function techniqueCounts(plan: LearningPlan | null) {
  const techniques = plan?.techniques ?? [];
  return {
    total: techniques.length,
    completed: techniques.filter(({ status }) => status === 'completed').length,
    skipped: techniques.filter(({ status }) => status === 'skipped').length,
  };
}
