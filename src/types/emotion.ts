export interface EmotionData {
  timestamp: number;
  emotion: string;
  confidence: number;
  stress_level: number;
}

export interface EmotionState {
  emotions: EmotionData[];
  isDarkMode: boolean;
  addEmotion: (emotion: EmotionData) => void;
  toggleTheme: () => void;
}

export interface APIKeys {
  huggingface: string;
  mistral: string;
  facePlusPlus: {
    key: string;
    secret: string;
  };
}