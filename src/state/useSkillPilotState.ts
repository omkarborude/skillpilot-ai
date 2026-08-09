import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { initialState } from '../data/seed';
import type { AppState, LearningGoal, PracticeSession, Technique, TechniqueStatus } from '../types/learning';
import { unique } from '../utils/progress';

const storageKey = 'skillpilot-native-state';

function resolveStatus(technique: Technique, state: AppState): TechniqueStatus {
  if (state.completedTechniqueIds.includes(technique.id)) return 'completed';
  if (state.skippedTechniqueIds.includes(technique.id)) return 'skipped';
  return technique.status;
}

export function useSkillPilotState() {
  const [state, setState] = useState<AppState>(initialState);
  const [isHydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(storageKey)
      .then((value) => {
        if (active && value) setState(JSON.parse(value) as AppState);
      })
      .finally(() => {
        if (active) setHydrated(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (isHydrated) void AsyncStorage.setItem(storageKey, JSON.stringify(state));
  }, [isHydrated, state]);

  const techniques = useMemo(
    () => state.plan.techniques.map((technique) => ({ ...technique, status: resolveStatus(technique, state) })),
    [state],
  );
  const currentTechnique = techniques.find((technique) => technique.status === 'available') ?? techniques[0];
  const selectedTechnique = techniques.find((technique) => technique.id === state.selectedTechniqueId) ?? currentTechnique;

  function setGoal(goal: LearningGoal) {
    setState((current) => ({ ...current, goal }));
  }

  function selectTechnique(techniqueId: string) {
    setState((current) => ({ ...current, selectedTechniqueId: techniqueId }));
  }

  function completeTechnique(techniqueId: string, minutes: number, notes: string) {
    const session: PracticeSession = { id: String(Date.now()), techniqueId, minutes, notes, completedAt: new Date().toISOString() };
    setState((current) => ({
      ...current,
      completedTechniqueIds: unique([...current.completedTechniqueIds, techniqueId]),
      skippedTechniqueIds: current.skippedTechniqueIds.filter((id) => id !== techniqueId),
      notesByTechniqueId: { ...current.notesByTechniqueId, [techniqueId]: notes },
      practiceHistory: [...current.practiceHistory, session],
      streak: Math.max(1, current.streak),
    }));
  }

  function skipTechnique(techniqueId: string) {
    setState((current) => ({
      ...current,
      skippedTechniqueIds: unique([...current.skippedTechniqueIds, techniqueId]),
      completedTechniqueIds: current.completedTechniqueIds.filter((id) => id !== techniqueId),
    }));
  }

  function replaceTechnique(techniqueId: string) {
    skipTechnique(techniqueId);
  }

  function reset() {
    setState(initialState);
    void AsyncStorage.removeItem(storageKey);
  }

  return { state, techniques, currentTechnique, selectedTechnique, isHydrated, setGoal, selectTechnique, completeTechnique, skipTechnique, replaceTechnique, reset };
}
