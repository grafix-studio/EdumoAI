import axios from 'axios';
import { EmotionData } from '../types/emotion';

const FACE_API_KEY = 'KAA-QhU_WvIrvIw-MZdGjI7PE0Q-quJg';
const FACE_API_SECRET = 'jcepSPpQNeGkxXL_HYiGU2NXxXFX647w';
const FACE_API_URL = 'https://api-us.faceplusplus.com/facepp/v3/detect';

export const analyzeFaceEmotion = async (imageData: string): Promise<EmotionData> => {
  try {
    // Remove data URL prefix and get base64 data
    const base64Image = imageData.split(';base64,').pop();
    if (!base64Image) {
      throw new Error('Invalid image data');
    }

    const formData = new FormData();
    formData.append('api_key', FACE_API_KEY);
    formData.append('api_secret', FACE_API_SECRET);
    formData.append('image_base64', base64Image);
    formData.append('return_attributes', 'emotion');

    const response = await axios.post(FACE_API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    if (!response.data.faces || response.data.faces.length === 0) {
      throw new Error('No face detected in the image');
    }

    const emotions = response.data.faces[0]?.attributes?.emotion || {};
    const dominantEmotion = Object.entries(emotions).reduce((a, b) => 
      (a[1] > b[1] ? a : b))[0];

    return {
      timestamp: Date.now(),
      emotion: dominantEmotion,
      confidence: emotions[dominantEmotion],
      stress_level: calculateStressLevel(emotions)
    };
  } catch (error) {
    console.error('Error analyzing face emotion:', error);
    throw error;
  }
};

const calculateStressLevel = (emotions: Record<string, number>): number => {
  // Simple stress calculation based on negative emotions
  const stressFactors = {
    sadness: 0.3,
    anger: 0.3,
    fear: 0.2,
    disgust: 0.2
  };

  return Object.entries(stressFactors).reduce((stress, [emotion, weight]) => {
    return stress + (emotions[emotion] || 0) * weight;
  }, 0) / 100;
};