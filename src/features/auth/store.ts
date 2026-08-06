import { create } from 'zustand';
type AuthState = { token?: string; setToken(token: string): void; logout(): void };
export const useAuthStore = create<AuthState>((set) => ({ setToken: (token) => set({ token }), logout: () => set({ token: undefined }) }));
