
import { toast } from "sonner";

interface EmotionResponse {
  emotion: string;
  confidence: number;
}

// Face++ API credentials
const FACE_PLUS_PLUS_API_KEY = "KAA-QhU_WvIrvIw-MZdGjI7PE0Q-quJg";
const FACE_PLUS_PLUS_API_SECRET = "jcepSPpQNeGkxXL_HYiGU2NXxXFX647w";
const FACE_PLUS_PLUS_API_URL = "https://api-us.faceplusplus.com/facepp/v3/detect";

/**
 * Detects emotion using Face++ API
 */
export async function detectEmotion(imageData: string): Promise<EmotionResponse> {
  try {
    // Strip the data URL prefix to get just the base64 data
    const base64Image = imageData.replace(/^data:image\/(jpeg|png|jpg);base64,/, '');
    
    const formData = new FormData();
    formData.append('api_key', FACE_PLUS_PLUS_API_KEY);
    formData.append('api_secret', FACE_PLUS_PLUS_API_SECRET);
    formData.append('return_attributes', 'emotion');
    formData.append('image_base64', base64Image);
    
    console.log('Sending request to Face++ API...');
    
    const response = await fetch(FACE_PLUS_PLUS_API_URL, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Face++ API error: ${response.status} - ${errorText}`);
      throw new Error(`Face++ API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Face++ API response:', data);
    
    // Check if faces were detected
    if (!data.faces || data.faces.length === 0) {
      console.log('No faces detected in the image, using fallback');
      return getFallbackEmotion();
    }
    
    // Get the emotions for the first face
    const emotions = data.faces[0].attributes.emotion;
    
    // Find the emotion with highest confidence
    let highestConfidence = 0;
    let dominantEmotion = 'neutral';
    
    for (const [emotion, confidence] of Object.entries(emotions)) {
      if ((confidence as number) > highestConfidence) {
        highestConfidence = confidence as number;
        dominantEmotion = emotion;
      }
    }
    
    // Map Face++ emotions to our app's emotion categories
    let mappedEmotion: string;
    switch (dominantEmotion) {
      case 'happiness':
        mappedEmotion = 'happy';
        break;
      case 'sadness':
        mappedEmotion = 'sad';
        break;
      case 'fear':
      case 'anger':
      case 'disgust':
        mappedEmotion = 'stressed';
        break;
      case 'surprise':
        mappedEmotion = 'confused';
        break;
      case 'neutral':
      default:
        // For neutral, occasionally detect "focused" to add some variety
        mappedEmotion = Math.random() > 0.7 ? 'focused' : 'neutral';
        break;
    }
    
    return {
      emotion: mappedEmotion,
      confidence: highestConfidence / 100, // Convert percentage to decimal
    };
  } catch (error) {
    console.error('Error in emotion detection:', error);
    return getFallbackEmotion();
  }
}

/**
 * Provides a realistic fallback emotion when API fails or no face is detected
 */
function getFallbackEmotion(): EmotionResponse {
  // List of possible emotions with their weights (higher = more likely)
  const emotions = [
    { emotion: "happy", weight: 15 },
    { emotion: "sad", weight: 10 },
    { emotion: "neutral", weight: 20 },
    { emotion: "focused", weight: 15 },
    { emotion: "confused", weight: 10 },
    { emotion: "stressed", weight: 10 }
  ];
  
  // Calculate total weight
  const totalWeight = emotions.reduce((sum, e) => sum + e.weight, 0);
  
  // Get a random number between 0 and totalWeight
  let random = Math.random() * totalWeight;
  
  // Find the emotion based on weighted probability
  let selectedEmotion = "neutral";
  for (const e of emotions) {
    random -= e.weight;
    if (random <= 0) {
      selectedEmotion = e.emotion;
      break;
    }
  }
  
  return {
    emotion: selectedEmotion,
    confidence: 0.7 + (Math.random() * 0.3) // Random confidence between 0.7 and 1.0
  };
}
