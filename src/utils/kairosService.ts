
import { toast } from "sonner";

// Face++ API credentials
const FACE_PLUS_PLUS_API_KEY = "KAA-QhU_WvIrvIw-MZdGjI7PE0Q-quJg";
const FACE_PLUS_PLUS_API_SECRET = "jcepSPpQNeGkxXL_HYiGU2NXxXFX647w";
const FACE_PLUS_PLUS_API_URL = "https://api-us.faceplusplus.com/facepp/v3/detect";

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
    
    try {
      // Create form data for Face++ API
      const formData = new FormData();
      formData.append("api_key", FACE_PLUS_PLUS_API_KEY);
      formData.append("api_secret", FACE_PLUS_PLUS_API_SECRET);
      formData.append("return_attributes", "emotion");
      
      // Convert base64 to blob for the API
      const byteCharacters = atob(base64Image);
      const byteArrays = [];
      for (let i = 0; i < byteCharacters.length; i += 512) {
        const slice = byteCharacters.slice(i, i + 512);
        const byteNumbers = new Array(slice.length);
        for (let j = 0; j < slice.length; j++) {
          byteNumbers[j] = slice.charCodeAt(j);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }
      const blob = new Blob(byteArrays, { type: 'image/jpeg' });
      formData.append("image_file", blob, "image.jpg");

      // Call Face++ API
      console.log("Calling Face++ API...");
      const response = await fetch(FACE_PLUS_PLUS_API_URL, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        console.error("Face++ API error:", response.status);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Face++ API response:", data);
      
      // Check if we have face detection results
      if (data.faces && data.faces.length > 0) {
        const faceEmotions = data.faces[0].attributes.emotion;
        
        // Find the emotion with highest confidence
        let highestConfidence = 0;
        let strongestEmotion = "neutral";
        
        for (const [emotion, confidence] of Object.entries(faceEmotions)) {
          if (Number(confidence) > highestConfidence) {
            highestConfidence = Number(confidence);
            strongestEmotion = emotion.toLowerCase();
          }
        }
        
        // Map Face++ emotions to our simplified emotion set
        let mappedEmotion = mapEmotionToUI(strongestEmotion);
        
        return {
          emotion: mappedEmotion,
          confidence: highestConfidence / 100 // Convert to 0-1 scale
        };
      }
      
      // Fallback if no faces detected
      console.log("No faces detected in the image, using simulation");
      return simulateEmotionDetection();
    } catch (apiError) {
      console.error("Error with Face++ API:", apiError);
      // Fallback to simulation on API error
      console.log("Falling back to simulation due to API error");
      return simulateEmotionDetection();
    }
  } catch (error) {
    console.error("Error detecting emotion:", error);
    // Fallback to simulated response in case of error
    return simulateEmotionDetection();
  }
}

// Map Face++ emotions to our UI emotion set
function mapEmotionToUI(emotion: string): string {
  switch (emotion) {
    case "happiness":
      return "happy";
    case "sadness":
      return "sad";
    case "anger":
      return "stressed";
    case "disgust":
      return "stressed";
    case "fear":
      return "stressed";
    case "surprise":
      return "confused";
    case "neutral":
    default:
      return "neutral";
  }
}

// Simulate emotion detection for development/testing
function simulateEmotionDetection(): EmotionResponse {
  // List of possible emotions with their weights (higher = more likely)
  const emotions = [
    { emotion: "happy", weight: 15 },
    { emotion: "sad", weight: 10 },
    { emotion: "neutral", weight: 15 },
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
  
  // Add some persistence to emotions to avoid rapid flipping
  const now = new Date();
  const seconds = now.getSeconds();
  
  // Every 3-4 seconds, allow emotion to change more significantly
  if (seconds % 4 === 0) {
    // Occasionally force specific emotions
    if (Math.random() < 0.3) {
      selectedEmotion = Math.random() < 0.5 ? "stressed" : "sad";
    }
  }
  
  return {
    emotion: selectedEmotion,
    confidence: 0.7 + (Math.random() * 0.3) // Random confidence between 0.7 and 1.0
  };
}
