import { useEffect, useMemo, useState } from 'react';
import { learningRepository } from '../services/repositories/learningRepository';
import { resolveTechniqueStatus, useAppStore } from '../shared/lib/appStore';
import type { LearningPlan, Profile } from '../shared/types/learning';

interface LearningDataState {
  plan: LearningPlan | null;
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
}

export function useLearningData() {
  const storePlan = useAppStore((state) => state.plan);
  const setPlan = useAppStore((state) => state.setPlan);
  const completedTechniqueIds = useAppStore((state) => state.completedTechniqueIds);
  const skippedTechniqueIds = useAppStore((state) => state.skippedTechniqueIds);
  const [state, setState] = useState<LearningDataState>({ plan: storePlan, profile: null, isLoading: true, error: null });

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [seedPlan, profile] = await Promise.all([learningRepository.getLearningPlan(), learningRepository.getProfile()]);
        if (!active) return;
        const plan = storePlan ?? seedPlan;
        if (!storePlan) setPlan(seedPlan);
        setState({ plan, profile, isLoading: false, error: null });
      } catch {
        if (active) setState((current) => ({ ...current, isLoading: false, error: 'Unable to load your learning plan.' }));
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [setPlan, storePlan]);

  const plan = useMemo(() => {
    if (!state.plan) return null;
    return {
      ...state.plan,
      techniques: state.plan.techniques.map((technique) => ({
        ...technique,
        status: resolveTechniqueStatus(technique.id, technique.status, { completedTechniqueIds, skippedTechniqueIds }),
      })),
    };
  }, [completedTechniqueIds, skippedTechniqueIds, state.plan]);

  return { ...state, plan };
}
