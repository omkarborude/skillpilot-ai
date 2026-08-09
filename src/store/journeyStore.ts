import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CoachMessage, LearnerGoal, LearningPlan, Technique, TechniqueStatus } from '@/types/learning';
import { replaceTechniqueInPlan, updateTechniqueStatus } from '@/utils/learning';

type JourneyState = {
  goal: LearnerGoal | null;
  plan: LearningPlan | null;
  practiceMinutes: number;
  streakDays: number;
  xp: number;
  coachMessages: CoachMessage[];
  setGoal: (goal: LearnerGoal) => void;
  setPlan: (plan: LearningPlan) => void;
  setTechniqueStatus: (techniqueId: string, status: TechniqueStatus) => void;
  applyTechniqueReplacement: (technique: Technique) => void;
  recordPractice: (minutes: number) => void;
  addCoachMessage: (message: CoachMessage) => void;
  resetJourney: () => void;
};

const initialCoachMessages: CoachMessage[] = [
  {
    id: 'coach-welcome',
    role: 'coach',
    content: 'Hi Omkar! I’m Nova. I can simplify today’s technique, practice it with you, or help replace it if it is not working.',
    createdAt: 0,
  },
];

export const useJourneyStore = create<JourneyState>()(
  persist(
    (set) => ({
      goal: null,
      plan: null,
      practiceMinutes: 225,
      streakDays: 8,
      xp: 120,
      coachMessages: initialCoachMessages,
      setGoal: (goal) => set({ goal }),
      setPlan: (plan) => set({ plan }),
      setTechniqueStatus: (techniqueId, status) =>
        set((state) => {
          const previousStatus = state.plan?.techniques.find(({ id }) => id === techniqueId)?.status;
          return {
            plan: state.plan ? updateTechniqueStatus(state.plan, techniqueId, status) : null,
            xp: status === 'completed' && previousStatus !== 'completed' ? state.xp + 25 : state.xp,
          };
        }),
      applyTechniqueReplacement: (technique) =>
        set((state) => ({
          plan: state.plan ? replaceTechniqueInPlan(state.plan, technique) : null,
        })),
      recordPractice: (minutes) =>
        set((state) => ({ practiceMinutes: state.practiceMinutes + minutes })),
      addCoachMessage: (message) =>
        set((state) => ({ coachMessages: [...state.coachMessages, message] })),
      resetJourney: () =>
        set({
          goal: null,
          plan: null,
          practiceMinutes: 0,
          streakDays: 0,
          xp: 0,
          coachMessages: initialCoachMessages,
        }),
    }),
    {
      name: 'skillpilot-journey-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ goal, plan, practiceMinutes, streakDays, xp, coachMessages }) => ({
        goal,
        plan,
        practiceMinutes,
        streakDays,
        xp,
        coachMessages,
      }),
    },
  ),
);
