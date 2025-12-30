import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  lastAction: string;
  setLastAction: (action: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      lastAction: 'No actions yet',
      setLastAction: (action: string) => set({ lastAction: action }),
      searchQuery: '',
      setSearchQuery: (query: string) => set({ searchQuery: query }),
    }),
    {
      name: 'next-task-storage', // Key for localStorage
    }
  )
);

