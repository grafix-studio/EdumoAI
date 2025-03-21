
import { useRef } from "react";
import { FileText, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { 
  processDocumentWithAI,
  generateStudyPlanWithAI,
  DocumentSection 
} from "../../utils/aiService";
import { parseDocument, SUPPORTED_FILE_TYPES } from "../../utils/documentParser";

interface DocumentUploaderProps {
  documentName: string | null;
  setDocumentName: (name: string | null) => void;
  setDocumentContent: (content: string | null) => void;
  setDocumentSections: (sections: DocumentSection[]) => void;
  setStudyPlan: (plan: {day: number, title: string, description: string, isComplete: boolean}[]) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
}

export default function DocumentUploader({
  documentName,
  setDocumentName,
  setDocumentContent,
  setDocumentSections,
  setStudyPlan,
  isProcessing,
  setIsProcessing
}: DocumentUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle document upload with optimized processing
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!SUPPORTED_FILE_TYPES.includes(fileExtension)) {
      toast.error(`Unsupported file type. Please upload ${SUPPORTED_FILE_TYPES.join(', ')}`);
      return;
    }
    
    setIsProcessing(true);
    toast.info(`Processing ${file.name}...`);
    
    try {
      // Parse the document content
      const content = await parseDocument(file);
      
      // Store the full content
      setDocumentContent(content);
      setDocumentName(file.name);
      
      // Show progress toast before AI processing
      toast.info("Analyzing document content...");
      
      // Process document into sections using AI
      const sections = await processDocumentWithAI(content);
      setDocumentSections(sections);
      console.log("Processed document sections:", sections);
      
      // Generate study plan based on sections
      const plan = await generateStudyPlanWithAI(sections);
      setStudyPlan(plan);
      
      setIsProcessing(false);
      toast.success(`Document "${file.name}" processed successfully`);
    } catch (error) {
      console.error("Error during document processing:", error);
      setIsProcessing(false);
      toast.error(`Failed to process document: ${error instanceof Error ? error.message : "Unknown error"}`);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Remove uploaded document
  const removeDocument = () => {
    setDocumentName(null);
    setDocumentContent(null);
    setDocumentSections([]);
    setStudyPlan([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info("Document removed");
  };

  if (!documentName) {
    return (
      <div className="glass-card p-8 text-center">
        <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-medium mb-2">Upload Learning Material</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Upload a PDF or text file to get started. Our AI will analyze the content
          and help you learn effectively.
        </p>
        
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept=".pdf,.txt"
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
    );
  }

  return (
    <div className="glass-card p-6 lg:col-span-1">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-medium">{documentName}</h3>
          <p className="text-sm text-muted-foreground">Processed document</p>
        </div>
        <button 
          className="p-2 rounded-full hover:bg-secondary/80 transition-all"
          onClick={removeDocument}
          disabled={isProcessing}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="bg-secondary/30 rounded-lg p-4 mb-4 text-sm max-h-[200px] overflow-y-auto scrollbar-hide">
        <p className="text-muted-foreground">Preview:</p>
        <p className="mt-2">
          {isProcessing 
            ? "Processing document content..." 
            : "Document processed successfully. Use the chat to ask questions or check your study plan."}
        </p>
      </div>
      
      <div className="mt-4">
        <p className="text-sm font-medium mb-2">Document Info:</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">File Type:</span>
            <span>{documentName.split('.').pop()?.toUpperCase()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Processing:</span>
            <span>{isProcessing ? "In progress..." : "Complete"}</span>
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
          disabled={isProcessing}
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Document</span>
        </button>
      </div>
    </div>
  );
}
