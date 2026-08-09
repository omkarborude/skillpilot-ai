import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LearningGoal, LearningPlan, PracticeSession, TechniqueStatus } from '../types/learning';

interface AppState {
  goal: LearningGoal;
  plan: LearningPlan | null;
  completedTechniqueIds: string[];
  skippedTechniqueIds: string[];
  notesByTechniqueId: Record<string, string>;
  practiceHistory: PracticeSession[];
  streak: number;
  setGoal: (goal: LearningGoal) => void;
  setPlan: (plan: LearningPlan) => void;
  completeTechnique: (techniqueId: string, minutes: number, notes: string) => void;
  skipTechnique: (techniqueId: string) => void;
  replaceTechnique: (techniqueId: string) => void;
  reset: () => void;
}

const defaultGoal: LearningGoal = {
  hobby: 'Guitar',
  goal: 'Play simple songs confidently around a campfire',
  level: 'beginner',
  dailyMinutes: 20,
};

function unique(values: string[]) {
  return Array.from(new Set(values));
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      goal: defaultGoal,
      plan: null,
      completedTechniqueIds: ['guitar-basics', 'essential-chords'],
      skippedTechniqueIds: [],
      notesByTechniqueId: {},
      practiceHistory: [
        { id: 'p1', techniqueId: 'guitar-basics', minutes: 20, notes: 'Cleaned up posture.', completedAt: '2026-08-05T18:00:00.000Z' },
        { id: 'p2', techniqueId: 'essential-chords', minutes: 25, notes: 'G and C feel better.', completedAt: '2026-08-07T18:00:00.000Z' },
      ],
      streak: 7,
      setGoal: (goal) => set({ goal }),
      setPlan: (plan) => set({ plan }),
      completeTechnique: (techniqueId, minutes, notes) =>
        set((state) => ({
          completedTechniqueIds: unique([...state.completedTechniqueIds, techniqueId]),
          skippedTechniqueIds: state.skippedTechniqueIds.filter((id) => id !== techniqueId),
          notesByTechniqueId: { ...state.notesByTechniqueId, [techniqueId]: notes },
          practiceHistory: [
            ...state.practiceHistory,
            { id: crypto.randomUUID(), techniqueId, minutes, notes, completedAt: new Date().toISOString() },
          ],
          streak: Math.max(state.streak, 1),
        })),
      skipTechnique: (techniqueId) =>
        set((state) => ({
          skippedTechniqueIds: unique([...state.skippedTechniqueIds, techniqueId]),
          completedTechniqueIds: state.completedTechniqueIds.filter((id) => id !== techniqueId),
        })),
      replaceTechnique: (techniqueId) =>
        set((state) => ({
          skippedTechniqueIds: unique([...state.skippedTechniqueIds, techniqueId]),
        })),
      reset: () =>
        set({
          goal: defaultGoal,
          plan: null,
          completedTechniqueIds: [],
          skippedTechniqueIds: [],
          notesByTechniqueId: {},
          practiceHistory: [],
          streak: 0,
        }),
    }),
    { name: 'skillpilot-learning-state' },
  ),
);

export function resolveTechniqueStatus(id: string, baseStatus: TechniqueStatus, state: Pick<AppState, 'completedTechniqueIds' | 'skippedTechniqueIds'>): TechniqueStatus {
  if (state.completedTechniqueIds.includes(id)) return 'completed';
  if (state.skippedTechniqueIds.includes(id)) return 'skipped';
  return baseStatus;
}
