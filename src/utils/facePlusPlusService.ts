
interface FacePlusPlusResponse {
  faces: {
    attributes: {
      emotion: {
        anger: number;
        disgust: number;
        fear: number;
        happiness: number;
        neutral: number;
        sadness: number;
        surprise: number;
      };
    };
  }[];
  time_used: number;
  image_id: string;
  request_id: string;
  error_message?: string;
}

export async function detectEmotionWithFacePlusPlus(imageData: string): Promise<{ emotion: string; confidence: number }> {
  try {
    // Strip the data URL prefix to get just the base64 data
    const base64Image = imageData.replace(/^data:image\/(jpeg|png|jpg);base64,/, '');
    
    const formData = new FormData();
    formData.append('api_key', 'KAA-QhU_WvIrvIw-MZdGjI7PE0Q-quJg');
    formData.append('api_secret', 'jcepSPpQNeGkxXL_HYiGU2NXxXFX647w');
    formData.append('return_attributes', 'emotion');
    formData.append('image_base64', base64Image);
    
    console.log('Sending request to Face++ API...');
    
    // Set timeout to prevent long-hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    try {
      const response = await fetch('https://api-us.faceplusplus.com/facepp/v3/detect', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Face++ API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json() as FacePlusPlusResponse;
      console.log('Face++ API response:', data);
      
      // Check if faces were detected
      if (!data.faces || data.faces.length === 0) {
        throw new Error('No faces detected in the image');
      }
      
      // Get the emotions for the first face
      const emotions = data.faces[0].attributes.emotion;
      
      // Find the emotion with highest confidence
      let highestConfidence = 0;
      let dominantEmotion = 'neutral';
      
      for (const [emotion, confidence] of Object.entries(emotions)) {
        if (confidence > highestConfidence) {
          highestConfidence = confidence;
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
          // Add some randomization to neutral to make it more interesting
          if (Math.random() > 0.7) {
            mappedEmotion = 'focused';
          } else {
            mappedEmotion = 'neutral';
          }
          break;
      }
      
      return {
        emotion: mappedEmotion,
        confidence: highestConfidence / 100, // Convert percentage to decimal
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (error) {
    console.error('Error in Face++ emotion detection:', error);
    throw error;
  }
}
