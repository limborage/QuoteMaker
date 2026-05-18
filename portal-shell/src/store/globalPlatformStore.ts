import { createStore } from 'zustand';

export interface PlatformState {
  user: {
    id: string;
    name: string;
    role: string;
  } | null;
  currency: string;
  isSidebarOpen: boolean;
  setCurrency: (currency: string) => void;
  setUser: (user: PlatformState['user']) => void;
  toggleSidebar: () => void;
}

export const globalPlatformStore = createStore<PlatformState>((set) => ({
  user: {
    id: 'EMP-4829',
    name: 'Lee Aaron',
    role: 'Administrator'
  },
  currency: 'ZAR', // Defaulting to South African Rand
  isSidebarOpen: true,
  setCurrency: (currency) => set({ currency }),
  setUser: (user) => set({ user }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

// @ts-ignore
window.__CORE_PLATFORM_STORE__ = globalPlatformStore;