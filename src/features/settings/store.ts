import { create } from 'zustand';
type SettingsState = { darkMode: boolean; notifications: boolean; toggleDarkMode(): void; toggleNotifications(): void };
export const useSettingsStore = create<SettingsState>((set) => ({ darkMode: false, notifications: true, toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })), toggleNotifications: () => set((s) => ({ notifications: !s.notifications })) }));
