
import { useState } from "react";
import { DocumentSection } from "../utils/openaiService";
import DocumentUploader from "./document-learning/DocumentUploader";
import DocumentTabs from "./document-learning/DocumentTabs";

export default function DocumentLearningSection() {
  // State for document upload and processing
  const [documentName, setDocumentName] = useState<string | null>(null);
  const [documentContent, setDocumentContent] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [studyPlan, setStudyPlan] = useState<{day: number, title: string, description: string, isComplete: boolean}[]>([]);
  const [documentSections, setDocumentSections] = useState<DocumentSection[]>([]);

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
        {!documentName ? (
          <DocumentUploader
            documentName={documentName}
            setDocumentName={setDocumentName}
            setDocumentContent={setDocumentContent}
            setDocumentSections={setDocumentSections}
            setStudyPlan={setStudyPlan}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DocumentUploader
              documentName={documentName}
              setDocumentName={setDocumentName}
              setDocumentContent={setDocumentContent}
              setDocumentSections={setDocumentSections}
              setStudyPlan={setStudyPlan}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
            
            <DocumentTabs 
              documentContent={documentContent}
              documentSections={documentSections}
              studyPlan={studyPlan}
              setStudyPlan={setStudyPlan}
              isProcessing={isProcessing}
            />
          </div>
        )}
      </div>
    </section>
  );
}
