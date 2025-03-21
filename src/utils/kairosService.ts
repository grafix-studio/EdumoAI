
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

    // For development/demo purposes, simulate a faster response with randomized emotions
    // In production, uncomment the actual API call below
    
    // Simulate API call for development purposes with faster responses
    // This helps demonstrate the UI functionality without API rate limits
    return simulateEmotionDetection();
    
    /* 
    // Actual API call - uncomment in production
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
        // Explicitly cast confidence to number before comparison
        const confidenceValue = Number(confidence);
        if (!isNaN(confidenceValue) && confidenceValue > highestConfidence) {
          highestConfidence = confidenceValue;
          strongestEmotion = emotion;
        }
      });
      
      // Map Kairos emotions to our simplified emotion set
      let mappedEmotion = mapEmotionToUI(strongestEmotion);
      
      return {
        emotion: mappedEmotion,
        confidence: highestConfidence
      };
    }
    
    return {
      emotion: "neutral",
      confidence: 0.5
    };
    */
  } catch (error) {
    console.error("Error detecting emotion with Kairos:", error);
    // Fallback to simulated response in case of error
    return simulateEmotionDetection();
  }
}

// Map Kairos emotions to our UI emotion set
function mapEmotionToUI(emotion: string): string {
  switch (emotion) {
    case "joy":
      return "happy";
    case "sadness":
      return "sad";
    case "anger":
    case "disgust":
      return "stressed";
    case "surprise":
    case "fear":
      return "confused";
    case "contempt":
      return "bored";
    default:
      return "neutral";
  }
}

// Simulate emotion detection for faster development/testing
function simulateEmotionDetection(): EmotionResponse {
  // List of possible emotions with their weights (higher = more likely)
  const emotions = [
    { emotion: "happy", weight: 15 },
    { emotion: "sad", weight: 10 },
    { emotion: "neutral", weight: 25 },
    { emotion: "focused", weight: 15 },
    { emotion: "confused", weight: 10 },
    { emotion: "stressed", weight: 10 },
    { emotion: "bored", weight: 15 }
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
  
  // Add some persistence to emotions by checking date to avoid rapid flipping
  // This creates more realistic emotion changes
  const now = new Date();
  const seconds = now.getSeconds();
  
  // Every 3-4 seconds, allow emotion to change more significantly
  if (seconds % 4 === 0) {
    // For demonstration, occasionally force specific emotions to show popup
    if (Math.random() < 0.3) {
      selectedEmotion = Math.random() < 0.5 ? "stressed" : "sad";
    }
  }
  
  return {
    emotion: selectedEmotion,
    confidence: 0.7 + (Math.random() * 0.3) // Random confidence between 0.7 and 1.0
  };
}
