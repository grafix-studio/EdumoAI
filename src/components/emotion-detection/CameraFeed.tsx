
import { useState } from "react";
import { Camera, Play, X, Loader2, Clock, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CameraFeedProps {
  isAnalyzing: boolean;
  cameraPermission: boolean | null;
  micPermission: boolean | null;
  timerCount?: number;
  startAnalysis: () => Promise<void>;
  stopAnalysis: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isProcessing?: boolean;
}

export default function CameraFeed({
  isAnalyzing,
  cameraPermission,
  micPermission,
  timerCount = 3,
  startAnalysis,
  stopAnalysis,
  videoRef,
  canvasRef,
  isProcessing = false
}: CameraFeedProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStartAnalysis = async () => {
    setIsLoading(true);
    await startAnalysis();
    setIsLoading(false);
  };

  return (
    <div className="glass-card p-6 flex flex-col h-full">
      <div className="relative aspect-video bg-black/10 dark:bg-white/5 rounded-lg overflow-hidden mb-4">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover"
        />
        <canvas 
          ref={canvasRef} 
          width="640" 
          height="480"
          className="hidden"
        />
        {!isAnalyzing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Camera className="w-12 h-12 text-muted-foreground opacity-50 mb-2" />
            <p className="text-sm text-muted-foreground">Camera feed will appear here</p>
          </div>
        )}
        
        {isAnalyzing && (
          <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Next update: {timerCount}s</span>
          </div>
        )}
        
        {isProcessing && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Scan className="w-10 h-10 text-primary animate-pulse" />
              <p className="text-sm font-medium">Analyzing facial expressions...</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            cameraPermission === true ? "bg-success" : 
            cameraPermission === false ? "bg-destructive" : "bg-muted"
          }`} />
          <span className="text-sm font-medium">Camera</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            micPermission === true ? "bg-success" : 
            micPermission === false ? "bg-destructive" : "bg-muted"
          }`} />
          <span className="text-sm font-medium">Microphone</span>
        </div>
      </div>
      
      {cameraPermission === false && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            Camera access is required for emotion detection. Please enable camera permissions in your browser settings.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="mt-auto">
        {!isAnalyzing ? (
          <Button 
            variant="default"
            onClick={handleStartAnalysis}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isLoading ? "Starting..." : "Start Detection"}</span>
          </Button>
        ) : (
          <Button 
            variant="secondary"
            onClick={stopAnalysis}
            className="w-full flex items-center justify-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Stop Detection</span>
          </Button>
        )}
      </div>
    </div>
  );
}
