import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { deviceStorage } from '@/services/deviceStorage';

type AuthState = {
  phoneNumber: string;
  isAuthenticated: boolean;
  hasStartedLearning: boolean;
  setPhoneNumber: (phoneNumber: string) => void;
  authenticate: () => void;
  completeOnboarding: () => void;
  restartOnboarding: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      phoneNumber: '',
      isAuthenticated: false,
      hasStartedLearning: false,
      setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
      authenticate: () => set({ isAuthenticated: true }),
      completeOnboarding: () => set({ hasStartedLearning: true }),
      restartOnboarding: () => set({ hasStartedLearning: false }),
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: 'skillpilot-auth-v1',
      storage: createJSONStorage(() => deviceStorage),
      partialize: ({ phoneNumber, isAuthenticated, hasStartedLearning }) => ({
        phoneNumber,
        isAuthenticated,
        hasStartedLearning,
      }),
    },
  ),
);
