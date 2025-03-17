
import { toast } from "sonner";

const KAIROS_API_KEY = "5f8fc07dfbcf8b5a7b49cb4d61a59bec";
const KAIROS_API_URL = "https://api.kairos.com";

export interface EmotionResponse {
  emotion: string;
  confidence: number;
}

export async function detectEmotion(imageData: string): Promise<EmotionResponse> {
  try {
    // Remove data URL prefix if present
    const base64Image = imageData.includes("base64,") 
      ? imageData.split("base64,")[1] 
      : imageData;

    const response = await fetch(`${KAIROS_API_URL}/v2/media/emotions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "app_id": "kairos_emotion_detection",
        "app_key": KAIROS_API_KEY
      },
      body: JSON.stringify({
        image: base64Image,
        selector: "FACE"
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Kairos API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Map the strongest emotion from Kairos response
    if (data.frames && data.frames.length > 0 && data.frames[0].people && data.frames[0].people.length > 0) {
      const emotions = data.frames[0].people[0].emotions;
      
      // Find the emotion with highest confidence
      let highestConfidence = 0;
      let strongestEmotion = "neutral";
      
      Object.entries(emotions).forEach(([emotion, confidence]) => {
        // Fix: Explicitly cast confidence to number before comparison
        const confidenceValue = Number(confidence);
        if (!isNaN(confidenceValue) && confidenceValue > highestConfidence) {
          highestConfidence = confidenceValue;
          strongestEmotion = emotion;
        }
      });
      
      // Map Kairos emotions to our simplified emotion set
      let mappedEmotion = "neutral";
      switch (strongestEmotion) {
        case "joy":
          mappedEmotion = "happy";
          break;
        case "sadness":
          mappedEmotion = "sad";
          break;
        case "anger":
        case "disgust":
          mappedEmotion = "stressed";
          break;
        case "surprise":
        case "fear":
          mappedEmotion = "confused";
          break;
        case "contempt":
          mappedEmotion = "bored";
          break;
        default:
          mappedEmotion = "neutral";
      }
      
      return {
        emotion: mappedEmotion,
        confidence: highestConfidence
      };
    }
    
    return {
      emotion: "neutral",
      confidence: 0.5
    };
  } catch (error) {
    console.error("Error detecting emotion with Kairos:", error);
    // Fallback to neutral in case of error
    return {
      emotion: "neutral",
      confidence: 0.5
    };
  }
}
