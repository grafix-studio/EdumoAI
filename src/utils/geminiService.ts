
import { toast } from "sonner";

const GEMINI_API_KEY = "AIzaSyDSgvUK1KarH_Mm97FUEYpDuWOU8g9lQJc";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta";

export interface DocumentSection {
  title: string;
  content: string;
}

export async function processDocumentWithGemini(content: string): Promise<DocumentSection[]> {
  try {
    const response = await fetch(`${GEMINI_API_URL}/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an AI assistant that helps with processing documents. I will provide you with a document text, and you need to analyze it and break it down into logical sections.

For each section, provide a title and the corresponding content. Format your response as a JSON array of objects, where each object has a "title" and "content" field.

Here's the document content:
${content}

Output the sections as valid JSON array without any additional text or explanation:
`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 8192
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response from Gemini API");
    }
    
    const textContent = data.candidates[0].content.parts[0].text;
    const jsonStartIdx = textContent.indexOf("[");
    const jsonEndIdx = textContent.lastIndexOf("]") + 1;
    const jsonStr = textContent.substring(jsonStartIdx, jsonEndIdx);
    
    // Parse the JSON string to get the sections
    const sections: DocumentSection[] = JSON.parse(jsonStr);
    return sections;
  } catch (error) {
    console.error("Error processing document with Gemini:", error);
    toast.error("Failed to process document. Please try again.");
    // Return a simple fallback section
    return [
      {
        title: "Document Content",
        content: content.substring(0, 1000) + (content.length > 1000 ? "..." : ""),
      },
    ];
  }
}

export async function generateStudyPlanWithGemini(sections: DocumentSection[]): Promise<{
  day: number;
  title: string;
  description: string;
  isComplete: boolean;
}[]> {
  try {
    // Prepare sections data for the API
    const sectionTitles = sections.map(section => section.title).join(", ");
    
    const response = await fetch(`${GEMINI_API_URL}/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an AI assistant that creates study plans. Based on the following document sections, create a study plan with daily learning objectives.

Document sections: ${sectionTitles}

Create a study plan with one day for each section, plus a final review day. For each day, provide:
1. The day number
2. A title for the day's study focus
3. A brief description of what to study

Format your response as a JSON array of objects without any additional text. Each object should have "day" (number), "title" (string), and "description" (string) fields:
`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 4096
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response from Gemini API");
    }
    
    const textContent = data.candidates[0].content.parts[0].text;
    const jsonStartIdx = textContent.indexOf("[");
    const jsonEndIdx = textContent.lastIndexOf("]") + 1;
    const jsonStr = textContent.substring(jsonStartIdx, jsonEndIdx);
    
    // Parse the JSON string to get the study plan
    const studyPlanData = JSON.parse(jsonStr);
    
    // Add isComplete field to each day
    return studyPlanData.map((day: any) => ({
      ...day,
      isComplete: false,
    }));
  } catch (error) {
    console.error("Error generating study plan with Gemini:", error);
    
    // Create a fallback study plan based on sections
    return sections.map((section, index) => ({
      day: index + 1,
      title: section.title,
      description: `Study the concepts related to ${section.title.toLowerCase()}.`,
      isComplete: false,
    })).concat([{
      day: sections.length + 1,
      title: "Final Review",
      description: "Synthesize all concepts and prepare summary notes.",
      isComplete: false,
    }]);
  }
}

export async function getGeminiChatResponse(
  query: string,
  documentContent: string,
  relevantSection: string
): Promise<string> {
  try {
    const response = await fetch(`${GEMINI_API_URL}/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an AI assistant that helps answer questions based on document content. 
You should only answer questions based on the information in the document. 
If the information is not in the document or the relevant section, politely say you don't have that information.
Here's the most relevant section of the document for the user's query: 

${relevantSection}

User query: ${query}`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response from Gemini API");
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error getting chat response from Gemini:", error);
    return "I'm having trouble connecting to the AI service. Please try again later.";
  }
}
