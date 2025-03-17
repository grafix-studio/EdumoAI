
import { useState } from "react";
import { MessageSquare, Calendar } from "lucide-react";
import DocumentChat from "./DocumentChat";
import StudyPlan from "./StudyPlan";
import { DocumentSection } from "../../utils/openaiService";

interface DocumentTabsProps {
  documentContent: string | null;
  documentSections: DocumentSection[];
  studyPlan: {day: number, title: string, description: string, isComplete: boolean}[];
  setStudyPlan: (plan: {day: number, title: string, description: string, isComplete: boolean}[]) => void;
  isProcessing: boolean;
}

export default function DocumentTabs({
  documentContent,
  documentSections,
  studyPlan,
  setStudyPlan,
  isProcessing
}: DocumentTabsProps) {
  const [selectedTab, setSelectedTab] = useState<'chat' | 'schedule'>('chat');

  return (
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
        <DocumentChat 
          documentContent={documentContent}
          documentSections={documentSections}
          isProcessing={isProcessing}
        />
      ) : (
        <StudyPlan 
          studyPlan={studyPlan}
          setStudyPlan={setStudyPlan}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
