import { useStore } from 'zustand';
import { createStore } from 'zustand';

interface PlatformState {
  user: { id: string; name: string; role: string; } | null;
  currency: string;
  isSidebarOpen: boolean;
  setCurrency: (currency: string) => void;
  setUser: (user: any) => void;
  toggleSidebar: () => void;
}

const localFallbackStore = createStore<PlatformState>((set) => ({
  user: { id: 'MOCK-000', name: 'Standalone User', role: 'Guest' },
  currency: 'USD',
  isSidebarOpen: false,
  setCurrency: (currency) => set({ currency }),
  setUser: (user) => set({ user }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

export function useSharedPlatformStore<T>(selector: (state: PlatformState) => T): T {
  // @ts-ignore
  const centralStore = window.__CORE_PLATFORM_STORE__;
  
  // If running inside the shell, hook into the shell's live memory store. Otherwise, use the fallback.
  const activeStore = centralStore || localFallbackStore;
  
  return useStore(activeStore, selector);
}