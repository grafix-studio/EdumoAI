
import { toast } from "sonner";

// Using OpenAI API key instead of Together.xyz API
const OPENAI_API_KEY = "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";

export interface DocumentSection {
  title: string;
  content: string;
}

export async function processDocumentWithOpenAI(content: string): Promise<DocumentSection[]> {
  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        prompt: `You are an AI assistant that helps with processing documents. I will provide you with a document text, and you need to analyze it and break it down into logical sections.

For each section, provide a title and the corresponding content. Format your response as a JSON array of objects, where each object has a "title" and "content" field.

Here's the document content:
${content}

Output the sections as valid JSON array without any additional text or explanation:`,
        max_tokens: 4000,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const jsonStartIdx = data.choices[0].text.indexOf("[");
    const jsonEndIdx = data.choices[0].text.lastIndexOf("]") + 1;
    const jsonStr = data.choices[0].text.substring(jsonStartIdx, jsonEndIdx);
    
    // Parse the JSON string to get the sections
    const sections: DocumentSection[] = JSON.parse(jsonStr);
    return sections;
  } catch (error) {
    console.error("Error processing document with OpenAI:", error);
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

export async function getOpenAIChatResponse(
  query: string,
  documentContent: string,
  relevantSection: string
): Promise<string> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant that helps answer questions based on document content. 
            You should only answer questions based on the information in the document. 
            If the information is not in the document or the relevant section, politely say you don't have that information.
            Here's the most relevant section of the document for the user's query: 
            
            ${relevantSection}`,
          },
          {
            role: "user",
            content: query,
          },
        ],
        max_tokens: 800,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error getting chat response from OpenAI:", error);
    return "I'm having trouble connecting to the AI service. Please try again later.";
  }
}

export async function generateStudyPlanWithOpenAI(sections: DocumentSection[]): Promise<{
  day: number;
  title: string;
  description: string;
  isComplete: boolean;
}[]> {
  try {
    // Prepare sections data for the API
    const sectionTitles = sections.map(section => section.title).join(", ");
    
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        prompt: `You are an AI assistant that creates study plans. Based on the following document sections, create a study plan with daily learning objectives.

Document sections: ${sectionTitles}

Create a study plan with one day for each section, plus a final review day. For each day, provide:
1. The day number
2. A title for the day's study focus
3. A brief description of what to study

Format your response as a JSON array of objects without any additional text. Each object should have "day" (number), "title" (string), and "description" (string) fields:`,
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const jsonStartIdx = data.choices[0].text.indexOf("[");
    const jsonEndIdx = data.choices[0].text.lastIndexOf("]") + 1;
    const jsonStr = data.choices[0].text.substring(jsonStartIdx, jsonEndIdx);
    
    // Parse the JSON string to get the study plan
    const studyPlanData = JSON.parse(jsonStr);
    
    // Add isComplete field to each day
    return studyPlanData.map((day: any) => ({
      ...day,
      isComplete: false,
    }));
  } catch (error) {
    console.error("Error generating study plan with OpenAI:", error);
    
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
