
import { toast } from "sonner";
import { chunkDocument } from "./documentParser";

// API Keys
const HUGGINGFACE_API_KEY = "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";
const MISTRAL_API_KEY = "DjyJA9MFtGcViA7SvdgIp3Fg4iH7tPrW";

export interface DocumentSection {
  title: string;
  content: string;
}

/**
 * Process document with AI (uses Hugging Face for document structure analysis)
 */
export async function processDocumentWithAI(content: string): Promise<DocumentSection[]> {
  try {
    // For large documents, chunk and analyze
    const contentChunks = chunkDocument(content, 8000);
    console.log(`Processing document in ${contentChunks.length} chunks`);
    
    if (contentChunks.length > 1) {
      toast.info(`Document is large. Processing in ${contentChunks.length} parts...`);
    }
    
    // Process first chunk to get document structure
    const firstChunkResult = await processChunkWithHuggingFace(contentChunks[0]);
    
    if (contentChunks.length === 1) {
      return firstChunkResult;
    }
    
    // For additional chunks, extract more sections
    const allSections: DocumentSection[] = [...firstChunkResult];
    
    for (let i = 1; i < contentChunks.length; i++) {
      toast.info(`Processing part ${i+1} of ${contentChunks.length}...`);
      const chunkSections = await processChunkWithHuggingFace(contentChunks[i]);
      allSections.push(...chunkSections);
    }
    
    return allSections;
  } catch (error) {
    console.error("Error processing document with AI:", error);
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

/**
 * Process a chunk of the document with Hugging Face
 */
async function processChunkWithHuggingFace(contentChunk: string): Promise<DocumentSection[]> {
  try {
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`
      },
      body: JSON.stringify({
        inputs: `<s>[INST]You are an AI assistant that helps with processing documents. I will provide you with a document text, and you need to analyze it and break it down into logical sections.

For each section, provide a title and the corresponding content. Format your response as a JSON array of objects, where each object has a "title" and "content" field.

Here's the document content:
${contentChunk}

Output the sections as valid JSON array without any additional text or explanation:[/INST]</s>`,
        parameters: {
          max_new_tokens: 4000,
          temperature: 0.2,
          return_full_text: false
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Hugging Face API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    let jsonText = data.generated_text;
    
    // Try to extract the JSON array from the response
    const jsonStartIdx = jsonText.indexOf("[");
    const jsonEndIdx = jsonText.lastIndexOf("]") + 1;
    
    if (jsonStartIdx >= 0 && jsonEndIdx > jsonStartIdx) {
      jsonText = jsonText.substring(jsonStartIdx, jsonEndIdx);
    }
    
    // Parse the JSON string to get the sections
    const sections: DocumentSection[] = JSON.parse(jsonText);
    return sections;
  } catch (error) {
    console.error("Error with Hugging Face API:", error);
    
    // Fallback to Mistral API
    console.log("Falling back to Mistral API");
    return processChunkWithMistral(contentChunk);
  }
}

/**
 * Process a chunk of the document with Mistral (fallback)
 */
async function processChunkWithMistral(contentChunk: string): Promise<DocumentSection[]> {
  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: "mistral-small",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant that helps with processing documents. You analyze document text and break it down into logical sections."
          },
          {
            role: "user",
            content: `Analyze this document text and break it down into logical sections. For each section, provide a title and the corresponding content. Format your response as a JSON array of objects, where each object has a "title" and "content" field.\n\n${contentChunk}`
          }
        ],
        temperature: 0.2,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Mistral API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Try to extract JSON from content
    const jsonStartIdx = content.indexOf("[");
    const jsonEndIdx = content.lastIndexOf("]") + 1;
    
    if (jsonStartIdx >= 0 && jsonEndIdx > jsonStartIdx) {
      const jsonStr = content.substring(jsonStartIdx, jsonEndIdx);
      // Parse the JSON string to get the sections
      return JSON.parse(jsonStr);
    }
    
    // If we couldn't find valid JSON, create a simple section
    return [
      {
        title: "Document Content",
        content: contentChunk.substring(0, 1000) + (contentChunk.length > 1000 ? "..." : ""),
      },
    ];
  } catch (error) {
    console.error("Error with Mistral API:", error);
    // Return a simple fallback section
    return [
      {
        title: "Document Content",
        content: contentChunk.substring(0, 1000) + (contentChunk.length > 1000 ? "..." : ""),
      },
    ];
  }
}

/**
 * Generate study plan with AI
 */
export async function generateStudyPlanWithAI(sections: DocumentSection[]): Promise<{
  day: number;
  title: string;
  description: string;
  isComplete: boolean;
}[]> {
  try {
    // Prepare sections data for the API
    const sectionTitles = sections.map(section => section.title).join(", ");
    
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: "mistral-small",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant that creates study plans based on document sections."
          },
          {
            role: "user",
            content: `Create a study plan based on these document sections: ${sectionTitles}. 
            
Create a study plan with one day for each section, plus a final review day. For each day, provide:
1. The day number
2. A title for the day's study focus
3. A brief description of what to study

Format your response as a JSON array of objects without any additional text. Each object should have "day" (number), "title" (string), and "description" (string) fields.`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Mistral API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Try to extract JSON from content
    const jsonStartIdx = content.indexOf("[");
    const jsonEndIdx = content.lastIndexOf("]") + 1;
    
    if (jsonStartIdx >= 0 && jsonEndIdx > jsonStartIdx) {
      const jsonStr = content.substring(jsonStartIdx, jsonEndIdx);
      // Parse the JSON string to get the study plan
      const studyPlanData = JSON.parse(jsonStr);
      
      // Add isComplete field to each day
      return studyPlanData.map((day: any) => ({
        ...day,
        isComplete: false,
      }));
    }
    
    throw new Error("Failed to parse study plan from AI response");
  } catch (error) {
    console.error("Error generating study plan with AI:", error);
    
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

/**
 * Get chat response from AI
 */
export async function getAIChatResponse(
  query: string,
  documentContent: string,
  relevantSection: string
): Promise<string> {
  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: "mistral-small",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant that helps answer questions based on document content. 
            You should only answer questions based on the information in the document. 
            If the information is not in the document or the relevant section, politely say you don't have that information.
            Here's the most relevant section of the document for the user's query: 
            
            ${relevantSection}`
          },
          {
            role: "user",
            content: query
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Mistral API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error getting chat response from AI:", error);
    return "I'm having trouble connecting to the AI service. Please try again later.";
  }
}
