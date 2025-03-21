
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { getAIChatResponse, DocumentSection } from "../../utils/aiService";

interface DocumentChatProps {
  documentContent: string | null;
  documentSections: DocumentSection[];
  isProcessing: boolean;
}

export default function DocumentChat({ 
  documentContent, 
  documentSections,
  isProcessing 
}: DocumentChatProps) {
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [userInput, setUserInput] = useState('');

  // Find relevant document section for the query
  const findRelevantSection = (query: string): string => {
    if (!documentSections.length) return "";
    
    // Simple keyword matching with scoring improvements
    const queryWords = query.toLowerCase().split(' ')
      .filter(word => word.length > 3) // Only consider words longer than 3 chars
      .map(word => word.replace(/[.,?!;:]/g, '')); // Remove punctuation
    
    if (queryWords.length === 0) return documentSections[0].content;
    
    // Score each section based on keyword matches
    const sectionScores = documentSections.map(section => {
      const sectionContent = section.content.toLowerCase();
      const sectionTitle = section.title.toLowerCase();
      let score = 0;
      
      queryWords.forEach(word => {
        // Check for exact word match
        const wordRegex = new RegExp(`\\b${word}\\b`, 'i');
        
        // Title matches are most important
        if (wordRegex.test(sectionTitle)) {
          score += 5;
        } else if (sectionTitle.includes(word)) {
          score += 3;
        }
        
        // Content matches
        if (wordRegex.test(sectionContent)) {
          score += 2;
        } else if (sectionContent.includes(word)) {
          score += 1;
        }
        
        // Bonus for frequent occurrences
        const occurrences = (sectionContent.match(new RegExp(word, 'gi')) || []).length;
        score += Math.min(occurrences / 5, 2); // Cap the bonus at 2 points
      });
      
      return { section, score };
    });
    
    // Sort by score and take the highest scoring section
    sectionScores.sort((a, b) => b.score - a.score);
    
    // If section has zero score but we have sections, return most relevant one
    if (sectionScores[0].score === 0 && documentSections.length > 0) {
      // Return a combined context from the first 2-3 sections (if available)
      const numSections = Math.min(3, documentSections.length);
      return documentSections.slice(0, numSections)
        .map(section => `## ${section.title}\n\n${section.content}`).join('\n\n');
    }
    
    return sectionScores[0].section.content;
  };

  // Handle chat input
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    
    const newMessage = { role: 'user' as const, content: userInput.trim() };
    setChatMessages([...chatMessages, newMessage]);
    setUserInput('');
    
    if (!documentContent) {
      // No document uploaded
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "Please upload a document first so I can answer questions about it." 
        }]);
      }, 500);
      return;
    }
    
    // Show loading state
    setChatMessages(prev => [...prev, { 
      role: 'assistant', 
      content: "Analyzing document content..." 
    }]);
    
    try {
      // Find the most relevant section for the query
      const relevantSection = findRelevantSection(newMessage.content);
      
      // Get response from AI
      const response = await getAIChatResponse(
        newMessage.content, 
        documentContent,
        relevantSection
      );
      
      // Update with the actual response and remove the loading message
      setChatMessages(prev => {
        // Remove the last "loading" message
        const withoutLoading = prev.slice(0, -1);
        // Add the actual response
        return [...withoutLoading, { role: 'assistant', content: response }];
      });
    } catch (error) {
      console.error("Error getting AI response:", error);
      setChatMessages(prev => {
        // Remove the last "loading" message
        const withoutLoading = prev.slice(0, -1);
        // Add an error message
        return [...withoutLoading, { 
          role: 'assistant', 
          content: "I'm having trouble analyzing the document. Please try again." 
        }];
      });
    }
  };

  return (
    <>
      {/* Chat Interface */}
      <div className="bg-secondary/30 rounded-lg p-4 mb-4 h-[300px] overflow-y-auto scrollbar-hide">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <MessageSquare className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              Ask questions about the document and I'll help you understand it better.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {chatMessages.map((msg, index) => (
              <div 
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <input 
          type="text" 
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask a question about the document..." 
          className="flex-1 px-4 py-2 rounded-lg bg-secondary/50 border border-border/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={isProcessing}
        />
        <button 
          className="btn-primary py-2"
          onClick={handleSendMessage}
          disabled={isProcessing}
        >
          Send
        </button>
      </div>
    </>
  );
}
