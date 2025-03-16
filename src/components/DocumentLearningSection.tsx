import { useState, useRef } from "react";
import { FileText, Upload, MessageSquare, Calendar, Clock, X, Plus, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function DocumentLearningSection() {
  // State for document upload and processing
  const [documentName, setDocumentName] = useState<string | null>(null);
  const [documentContent, setDocumentContent] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [userInput, setUserInput] = useState('');
  const [selectedTab, setSelectedTab] = useState<'chat' | 'schedule'>('chat');
  const [studyPlan, setStudyPlan] = useState<{day: number, title: string, description: string, isComplete: boolean}[]>([]);
  const [documentSections, setDocumentSections] = useState<{title: string, content: string}[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle document upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      toast.info(`Processing ${file.name}...`);
      
      // Use FileReader to read the file content
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        
        // Store the full content
        setDocumentContent(content);
        setDocumentName(file.name);
        
        // Process document into sections (in a real app, this would use NLP)
        processDocumentIntoSections(content);
        
        // Simulate document processing
        setTimeout(() => {
          setIsProcessing(false);
          generateMockStudyPlan();
          toast.success(`Document "${file.name}" processed successfully`);
        }, 1500);
      };
      
      reader.readAsText(file);
    }
  };

  // Process document into sections (simplified for demo)
  const processDocumentIntoSections = (content: string) => {
    // This is a simplified version - in a real app, this would use NLP to identify sections
    const sections = [];
    
    // Split by lines and create sections (simple approach)
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    
    // Create mock sections
    let currentSection = { title: "Introduction", content: "" };
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // If line might be a heading (short line)
      if (line.length < 50 && !line.endsWith('.') && !currentSection.content) {
        currentSection.title = line;
      } else {
        currentSection.content += line + " ";
        
        // Create a new section every ~500 characters
        if (currentSection.content.length > 500 && i < lines.length - 1) {
          sections.push({...currentSection});
          // Generate a title based on content for the next section
          const nextTitle = `Section ${sections.length + 1}`;
          currentSection = { title: nextTitle, content: "" };
        }
      }
    }
    
    // Add the last section if it has content
    if (currentSection.content) {
      sections.push(currentSection);
    }
    
    setDocumentSections(sections);
    console.log("Processed document sections:", sections);
  };

  // Remove uploaded document
  const removeDocument = () => {
    setDocumentName(null);
    setDocumentContent(null);
    setChatMessages([]);
    setStudyPlan([]);
    setDocumentSections([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info("Document removed");
  };

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
  const handleSendMessage = () => {
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
    
    // Simulate AI response based on document content
    setTimeout(() => {
      const relevantSection = findRelevantSection(newMessage.content);
      
      // Generate a response based on the query and relevant section
      const response = generateResponse(newMessage.content, relevantSection);
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1000);
  };

  // Generate a response based on the query and relevant document section
  const generateResponse = (query: string, relevantContent: string): string => {
    if (!relevantContent) {
      return "I couldn't find information related to your question in the document. Could you try rephrasing your question?";
    }
    
    // Extract sentences from the relevant content that might contain the answer
    const sentences = relevantContent.split('.').filter(s => s.trim().length > 0);
    
    // Simple keyword matching (in a real app, this would use an LLM)
    const queryWords = query.toLowerCase().split(' ')
      .filter(word => word.length > 3)
      .map(word => word.replace(/[.,?!;:]/g, ''));
    
    // Find sentences with the most keyword matches
    const matchedSentences = sentences.filter(sentence => {
      const sentenceLower = sentence.toLowerCase();
      return queryWords.some(word => sentenceLower.includes(word));
    });
    
    if (matchedSentences.length > 0) {
      // Combine the matched sentences into a response
      return matchedSentences.join('. ') + '.';
    } else {
      // If no direct matches, return a portion of the relevant content
      const excerpt = relevantContent.substring(0, 200) + "...";
      return `Based on the document, I found this information which might be relevant: "${excerpt}"`;
    }
  };

  // Generate a mock study plan
  const generateMockStudyPlan = () => {
    if (!documentSections.length) {
      const mockPlan = [
        {
          day: 1,
          title: "Introduction & Fundamentals",
          description: "Review the core concepts and terminology introduced in the first section.",
          isComplete: false
        },
        {
          day: 2,
          title: "Key Methodologies",
          description: "Study the methodological approaches outlined in the middle sections.",
          isComplete: false
        },
        {
          day: 3,
          title: "Advanced Applications",
          description: "Focus on the practical applications and case studies.",
          isComplete: false
        },
        {
          day: 4,
          title: "Review & Synthesis",
          description: "Synthesize all concepts and prepare summary notes.",
          isComplete: false
        }
      ];
      
      setStudyPlan(mockPlan);
      return;
    }
    
    // Create a study plan based on the document sections
    const plan = documentSections.map((section, index) => ({
      day: index + 1,
      title: section.title,
      description: `Study the concepts related to ${section.title.toLowerCase()}.`,
      isComplete: false
    }));
    
    // Add a review day at the end
    plan.push({
      day: plan.length + 1,
      title: "Final Review",
      description: "Synthesize all concepts and prepare summary notes.",
      isComplete: false
    });
    
    setStudyPlan(plan);
  };

  return (
    <section id="documents" className="section">
      <div className="section-header">
        <span className="chip mb-2">AI-Learning</span>
        <h1 className="text-balance">Document Learning Assistant</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
          Upload any document and our AI will help you understand it, answer your questions, 
          and create a personalized study plan.
        </p>
      </div>
      
      <div className="max-w-5xl mx-auto w-full">
        {/* Document Upload Area */}
        {!documentName ? (
          <div className="glass-card p-8 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-medium mb-2">Upload Learning Material</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Upload a PDF, Word document, or text file to get started. Our AI will analyze the content
              and help you learn effectively.
            </p>
            
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
            />
            
            <button 
              className="btn-primary flex items-center space-x-2 mx-auto"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Document Info */}
            <div className="glass-card p-6 lg:col-span-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-medium">{documentName}</h3>
                  <p className="text-sm text-muted-foreground">Processed document</p>
                </div>
                <button 
                  className="p-2 rounded-full hover:bg-secondary/80 transition-all"
                  onClick={removeDocument}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="bg-secondary/30 rounded-lg p-4 mb-4 text-sm max-h-[200px] overflow-y-auto scrollbar-hide">
                <p className="text-muted-foreground">Preview:</p>
                <p className="mt-2">{documentContent}</p>
              </div>
              
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Document Info:</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">File Type:</span>
                    <span>{documentName.split('.').pop()?.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Sections:</span>
                    <span>4</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Estimated Read Time:</span>
                    <span>15 mins</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                />
                
                <button 
                  className="btn-secondary w-full flex items-center justify-center space-x-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload New Document</span>
                </button>
              </div>
            </div>
            
            {/* Document Learning Tools */}
            <div className="glass-card p-6 lg:col-span-2">
              {/* Tabs */}
              <div className="flex items-center space-x-2 mb-6 border-b border-border/50">
                <button 
                  className={`px-4 py-2 text-sm font-medium ${selectedTab === 'chat' ? 'border-b-2 border-primary' : 'text-muted-foreground'}`}
                  onClick={() => setSelectedTab('chat')}
                >
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Document Chat</span>
                  </div>
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-medium ${selectedTab === 'schedule' ? 'border-b-2 border-primary' : 'text-muted-foreground'}`}
                  onClick={() => setSelectedTab('schedule')}
                >
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Study Plan</span>
                  </div>
                </button>
              </div>
              
              {selectedTab === 'chat' ? (
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
                    />
                    <button 
                      className="btn-primary py-2"
                      onClick={handleSendMessage}
                    >
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Study Plan */}
                  <div className="space-y-4">
                    {studyPlan.length === 0 ? (
                      <div className="p-8 text-center">
                        <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">
                          Loading your personalized study plan...
                        </p>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-medium">Your Personalized Study Plan</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Based on the document content, we've created a study plan to help you 
                          learn the material efficiently.
                        </p>
                        
                        <div className="space-y-3">
                          {studyPlan.map((day, index) => (
                            <div 
                              key={index}
                              className={`p-4 rounded-lg border ${day.isComplete ? 'bg-success/10 border-success/30' : 'bg-secondary/30 border-border/50'}`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="chip">Day {day.day}</span>
                                    <h4 className="font-medium">{day.title}</h4>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {day.description}
                                  </p>
                                </div>
                                <input 
                                  type="checkbox" 
                                  checked={day.isComplete}
                                  onChange={() => {
                                    const newPlan = [...studyPlan];
                                    newPlan[index].isComplete = !newPlan[index].isComplete;
                                    setStudyPlan(newPlan);
                                  }}
                                  className="w-5 h-5 rounded-md border-2"
                                />
                              </div>
                              
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-1 text-muted-foreground">
                                  <Clock className="w-4 h-4" />
                                  <span>Estimated time: 30 mins</span>
                                </div>
                                
                                <button className="text-primary flex items-center space-x-1">
                                  <span>Start learning</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <button className="mt-4 w-full py-2 border border-dashed border-border/70 rounded-lg text-sm text-muted-foreground hover:bg-secondary/50 transition-all flex items-center justify-center space-x-2">
                          <Plus className="w-4 h-4" />
                          <span>Add Custom Study Session</span>
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
