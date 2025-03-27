import { useState } from "react";
import { toast } from "sonner";

export interface MessageType {
  role: "user" | "assistant";
  content: string;
}

// Website data that will be used to answer user queries
const websiteInfo = {
  name: "EdumoAi",
  description: "AI - Powered Emotional Intelligence Tutor",
  features: [
    {
      name: "Emotion Detection",
      description:
        "Computer vision that detects student engagement and emotional states to improve learning experiences.",
    },
    {
      name: "Document Learning Assistant",
      description:
        "Upload any document and our AI will help you understand it, answer questions, and create a personalized study plan.",
    },
    {
      name: "Mind Activities",
      description:
        "Brain games and cognitive exercises including Memory Match, Sudoku, Word Association, Math Fluency, Pattern Recognition, and more.",
    },
    {
      name: "Task Manager",
      description:
        "AI-powered task management tool that helps organize, prioritize, and complete tasks efficiently.",
    },
    {
      name: "Mentorship",
      description:
        "Connect with experienced mentors who provide personalized guidance for learning and professional goals.",
    },
  ],
  team: [
    "Alex Johnson - Lead Developer",
    "Maya Rodriguez - UX/UI Designer",
    "David Kim - AI Specialist",
    "Priya Patel - Educational Content",
  ],
  contactInfo: "support@EdumoAi.ai",
};

export function useWebsiteChatbot() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Process user message and generate a response
  const generateResponse = async (userMessage: string): Promise<string> => {
    // Convert the message to lowercase for easier matching
    const lowerCaseMessage = userMessage.toLowerCase();

    // Greeting patterns
    if (
      lowerCaseMessage.includes("hello") ||
      lowerCaseMessage.includes("hi") ||
      lowerCaseMessage.match(/^hey\b/)
    ) {
      return "Hello! Welcome to EdumoAi. How can I help you today?";
    }

    // About the platform
    if (
      lowerCaseMessage.includes("what is") ||
      lowerCaseMessage.includes("about") ||
      lowerCaseMessage.includes("tell me about")
    ) {
      if (
        lowerCaseMessage.includes("EdumoAi") ||
        lowerCaseMessage.includes("platform") ||
        lowerCaseMessage.includes("website") ||
        lowerCaseMessage.includes("this site")
      ) {
        return `${websiteInfo.name} is an ${websiteInfo.description}. It offers features like emotion detection for students, document learning assistance, mind activity games, AI task management, and personalized mentorship.`;
      }

      // About specific features
      for (const feature of websiteInfo.features) {
        if (lowerCaseMessage.includes(feature.name.toLowerCase())) {
          return `${feature.name}: ${feature.description}`;
        }
      }
    }

    // Features list
    if (
      lowerCaseMessage.includes("features") ||
      lowerCaseMessage.includes("what can you do") ||
      lowerCaseMessage.includes("functionalities") ||
      lowerCaseMessage.includes("capabilities")
    ) {
      const featuresList = websiteInfo.features
        .map((f) => `• ${f.name}: ${f.description}`)
        .join("\n");

      return `Here are the main features of ${websiteInfo.name}:\n\n${featuresList}`;
    }

    // Team information
    if (
      lowerCaseMessage.includes("team") ||
      lowerCaseMessage.includes("who made") ||
      lowerCaseMessage.includes("developers") ||
      lowerCaseMessage.includes("creators")
    ) {
      return `The ${
        websiteInfo.name
      } team consists of:\n• ${websiteInfo.team.join("\n• ")}`;
    }

    // Contact information
    if (
      lowerCaseMessage.includes("contact") ||
      lowerCaseMessage.includes("email") ||
      lowerCaseMessage.includes("support") ||
      lowerCaseMessage.includes("help")
    ) {
      return `You can contact the ${websiteInfo.name} team at ${websiteInfo.contactInfo}`;
    }

    // Games and activities
    if (
      lowerCaseMessage.includes("games") ||
      lowerCaseMessage.includes("mind activities") ||
      lowerCaseMessage.includes("activities") ||
      lowerCaseMessage.includes("play")
    ) {
      return "EdumoAi offers various mind activities and games including Memory Match, Word Association, Math Fluency, Pattern Recognition, Sudoku Challenge, and more. These games are designed to improve cognitive abilities and make learning fun.";
    }

    // Document learning
    if (
      lowerCaseMessage.includes("document") ||
      lowerCaseMessage.includes("upload") ||
      lowerCaseMessage.includes("study plan") ||
      lowerCaseMessage.includes("pdf")
    ) {
      return "The Document Learning Assistant allows you to upload any document and our AI will help you understand it, answer questions about the content, and create a personalized study plan to master the material.";
    }

    // AI capabilities
    if (
      lowerCaseMessage.includes("ai") ||
      lowerCaseMessage.includes("artificial intelligence") ||
      lowerCaseMessage.includes("machine learning")
    ) {
      return "EdumoAi uses advanced AI technologies throughout the platform, including computer vision for emotion detection, natural language processing for document analysis, and personalized learning algorithms to adapt to each user's needs.";
    }

    // Fallback response
    return "I don't have specific information about that, but I'd be happy to tell you about EdumoAi's features, our team, or how to contact support. What would you like to know?";
  };

  // Add a message to the chat
  const sendMessage = async (userMessage: string) => {
    try {
      setIsLoading(true);

      // Add user message
      const userMsg: MessageType = {
        role: "user",
        content: userMessage,
      };

      setMessages((prev) => [...prev, userMsg]);

      // Generate response
      const response = await generateResponse(userMessage);

      // Add bot response with a small delay to make it feel more natural
      setTimeout(() => {
        const botMsg: MessageType = {
          role: "assistant",
          content: response,
        };

        setMessages((prev) => [...prev, botMsg]);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error in chatbot:", error);
      setIsLoading(false);

      // Add error message
      toast.error("Sorry, I encountered an error. Please try again.");
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
  };
}
