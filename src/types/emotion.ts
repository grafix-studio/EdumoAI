export interface EmotionData {
  timestamp: number;
  emotion: string;
  confidence: number;
  stress_level: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface EmotionAnalysis {
  dominant_emotion: string;
  emotions: {
    happiness: number;
    sadness: number;
    confusion: number;
    frustration: number;
    stress: number;
  };
}