import { create } from 'zustand';
import { EmotionState, EmotionData } from '../types/emotion';

export const useEmotionStore = create<EmotionState>((set) => ({
  emotions: [],
  isDarkMode: false,
  addEmotion: (emotion: EmotionData) =>
    set((state) => ({
      emotions: [...state.emotions, emotion],
    })),
  toggleTheme: () =>
    set((state) => ({
      isDarkMode: !state.isDarkMode,
    })),
}));