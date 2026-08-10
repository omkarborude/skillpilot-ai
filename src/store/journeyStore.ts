import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { deviceStorage } from '@/services/deviceStorage';
import { CoachMessage, LearnerGoal, LearningPlan, PracticeSession, Technique, TechniqueStatus } from '@/types/learning';
import { replaceTechniqueInPlan, updateTechniqueStatus } from '@/utils/learning';

type JourneyState = {
  goal: LearnerGoal | null;
  plan: LearningPlan | null;
  practiceMinutes: number;
  streakDays: number;
  xp: number;
  practiceSessions: PracticeSession[];
  coachMessages: CoachMessage[];
  setGoal: (goal: LearnerGoal) => void;
  setPlan: (plan: LearningPlan) => void;
  setTechniqueStatus: (techniqueId: string, status: TechniqueStatus) => void;
  applyTechniqueReplacement: (technique: Technique) => void;
  recordPractice: (minutes: number, techniqueId: string) => void;
  addCoachMessage: (message: CoachMessage) => void;
  resetJourney: () => void;
};

type LegacyLearningResource = {
  id: string;
  type: Technique['resources'][number]['type'];
  title?: string;
  searchQuery?: string;
  description: string;
};

const createInitialCoachMessages = (): CoachMessage[] => [
  {
    id: 'coach-welcome',
    role: 'coach',
    content: 'Hi! I’m Nova. I can simplify your current technique, practice it with you, or help find a better approach.',
    createdAt: Date.now(),
  },
];

export function migrateJourneyState(persisted: unknown, version: number): JourneyState {
  let state = persisted as Partial<JourneyState>;

  if (version < 2) {
    state = {
      ...state,
      practiceMinutes: 0,
      streakDays: 0,
      xp: 0,
      practiceSessions: [],
      coachMessages: createInitialCoachMessages(),
    };
  }

  if (version < 3 && state.plan) {
    const hobbyName = state.goal?.customHobby ?? state.goal?.hobbyName ?? state.plan.title;
    state = {
      ...state,
      plan: {
        ...state.plan,
        techniques: state.plan.techniques.map((technique) => ({
          ...technique,
          resources: technique.resources.map((currentResource) => {
            const resource = currentResource as LegacyLearningResource;
            if (resource.type === 'practice') {
              return { id: resource.id, type: 'practice' as const, description: resource.description };
            }

            return {
              id: resource.id,
              type: resource.type,
              searchQuery:
                resource.searchQuery?.trim() ||
                `${hobbyName} ${resource.title ?? technique.shortTitle}`.trim(),
              description: resource.description,
            };
          }),
        })),
      },
    };
  }

  return state as JourneyState;
}

export const useJourneyStore = create<JourneyState>()(
  persist(
    (set) => ({
      goal: null,
      plan: null,
      practiceMinutes: 0,
      streakDays: 0,
      xp: 0,
      practiceSessions: [],
      coachMessages: createInitialCoachMessages(),
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
      recordPractice: (minutes, techniqueId) =>
        set((state) => {
          const completedAt = Date.now();
          const session: PracticeSession = {
            id: `practice-${completedAt}`,
            techniqueId,
            minutes,
            completedAt,
          };
          const practiceSessions = [...state.practiceSessions, session];
          const activeDates = new Set(
            practiceSessions.map(({ completedAt: timestamp }) => new Date(timestamp).toDateString()),
          );
          let streakDays = 0;
          const cursor = new Date();
          while (activeDates.has(cursor.toDateString())) {
            streakDays += 1;
            cursor.setDate(cursor.getDate() - 1);
          }
          return {
            practiceMinutes: state.practiceMinutes + minutes,
            practiceSessions,
            streakDays,
          };
        }),
      addCoachMessage: (message) =>
        set((state) => ({ coachMessages: [...state.coachMessages, message] })),
      resetJourney: () =>
        set({
          goal: null,
          plan: null,
          practiceMinutes: 0,
          streakDays: 0,
          xp: 0,
          practiceSessions: [],
          coachMessages: createInitialCoachMessages(),
        }),
    }),
    {
      name: 'skillpilot-journey-v1',
      storage: createJSONStorage(() => deviceStorage),
      version: 3,
      migrate: migrateJourneyState,
      partialize: ({ goal, plan, practiceMinutes, streakDays, xp, practiceSessions, coachMessages }) => ({
        goal,
        plan,
        practiceMinutes,
        streakDays,
        xp,
        practiceSessions,
        coachMessages,
      }),
    },
  ),
);
