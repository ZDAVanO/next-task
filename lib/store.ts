import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = { value: 0 };

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => { state.value += 1; },
    decrement: (state) => { state.value -= 1; },
  },
});

export const { increment, decrement } = counterSlice.actions;

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;





// lib/store.ts
import { create } from 'zustand';

interface AppState {
  lastAction: string;
  setLastAction: (action: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  lastAction: 'Жодної дії ще не було',
  setLastAction: (action: string) => set({ lastAction: action }),
}));

