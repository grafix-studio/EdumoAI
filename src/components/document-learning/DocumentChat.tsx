
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { getOpenAIChatResponse, DocumentSection } from "../../utils/openaiService";

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
    
    // Simple keyword matching (in a real app, this would use embeddings and semantic search)
    const queryWords = query.toLowerCase().split(' ')
      .filter(word => word.length > 3) // Only consider words longer than 3 chars
      .map(word => word.replace(/[.,?!;:]/g, '')); // Remove punctuation
    
    if (queryWords.length === 0) return documentSections[0].content;
    
    // Score each section based on keyword matches
    const sectionScores = documentSections.map(section => {
      const sectionContent = section.content.toLowerCase();
      let score = 0;
      
      queryWords.forEach(word => {
        if (sectionContent.includes(word)) {
          score += 1;
          
          // Bonus for words in the title
          if (section.title.toLowerCase().includes(word)) {
            score += 2;
          }
        }
      });
      
      return { section, score };
    });
    
    // Sort by score and take the highest scoring section
    sectionScores.sort((a, b) => b.score - a.score);
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
      
      // Get response from OpenAI
      const response = await getOpenAIChatResponse(
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
