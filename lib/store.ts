import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  lastAction: string;
  setLastAction: (action: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  taskFilter: 'all' | 'active' | 'completed';
  setTaskFilter: (filter: 'all' | 'active' | 'completed') => void;
  sortBy: 'position' | 'title' | 'date';
  setSortBy: (sort: 'position' | 'title' | 'date') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      lastAction: 'No actions yet',
      setLastAction: (action: string) => set({ lastAction: action }),
      searchQuery: '',
      setSearchQuery: (query: string) => set({ searchQuery: query }),
      taskFilter: 'all',
      setTaskFilter: (filter) => set({ taskFilter: filter }),
      sortBy: 'position',
      setSortBy: (sort) => set({ sortBy: sort }),
    }),
    {
      name: 'next-task-storage', // Key for localStorage
    }
  )
);

