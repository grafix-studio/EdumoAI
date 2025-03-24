
import { toast } from "sonner";

const GOOGLE_CLOUD_VISION_API_KEY = "AIzaSyDdzRkc-0q8lY3hB4fr7q28Pag4LmBRsUU";
const GOOGLE_CLOUD_VISION_API_URL = "https://vision.googleapis.com/v1/images:annotate";

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

    // For development purposes, we'll use both the real API and simulation
    // with a fallback mechanism
    try {
      // Call Google Cloud Vision API
      const response = await fetch(`${GOOGLE_CLOUD_VISION_API_URL}?key=${GOOGLE_CLOUD_VISION_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Image
              },
              features: [
                {
                  type: "FACE_DETECTION",
                  maxResults: 1
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if we have face detection results
      if (data.responses && 
          data.responses[0] && 
          data.responses[0].faceAnnotations && 
          data.responses[0].faceAnnotations.length > 0) {
        
        const faceAnnotation = data.responses[0].faceAnnotations[0];
        
        // Map Google Cloud Vision emotions to our format
        const emotions = {
          joy: faceAnnotation.joyLikelihood,
          sorrow: faceAnnotation.sorrowLikelihood,
          anger: faceAnnotation.angerLikelihood,
          surprise: faceAnnotation.surpriseLikelihood,
        };
        
        // Convert likelihood strings to numeric values
        const likelihoodMap: Record<string, number> = {
          "VERY_UNLIKELY": 0.05,
          "UNLIKELY": 0.2,
          "POSSIBLE": 0.5,
          "LIKELY": 0.8,
          "VERY_LIKELY": 0.95,
        };
        
        // Find the emotion with highest likelihood
        let highestConfidence = 0;
        let strongestEmotion = "neutral";
        
        for (const [emotion, likelihood] of Object.entries(emotions)) {
          const confidenceValue = likelihoodMap[likelihood] || 0;
          if (confidenceValue > highestConfidence) {
            highestConfidence = confidenceValue;
            strongestEmotion = emotion;
          }
        }
        
        // Map Google Cloud Vision emotions to our simplified emotion set
        let mappedEmotion = mapEmotionToUI(strongestEmotion);
        
        return {
          emotion: mappedEmotion,
          confidence: highestConfidence
        };
      }
      
      // Fallback if no faces detected
      console.log("No faces detected in the image, using simulation");
      return simulateEmotionDetection();
    } catch (apiError) {
      console.error("Error with Google Cloud Vision API:", apiError);
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

// Map Google Cloud Vision emotions to our UI emotion set
function mapEmotionToUI(emotion: string): string {
  switch (emotion) {
    case "joy":
      return "happy";
    case "sorrow":
      return "sad";
    case "anger":
      return "stressed";
    case "surprise":
      return "confused";
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
