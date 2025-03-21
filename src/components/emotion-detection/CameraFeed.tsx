
import { useState, useRef, useEffect } from "react";
import { Camera, Play, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface CameraFeedProps {
  isAnalyzing: boolean;
  cameraPermission: boolean | null;
  micPermission: boolean | null;
  startAnalysis: () => Promise<void>;
  stopAnalysis: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export default function CameraFeed({
  isAnalyzing,
  cameraPermission,
  micPermission,
  startAnalysis,
  stopAnalysis,
  videoRef,
  canvasRef
}: CameraFeedProps) {
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
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="w-12 h-12 text-muted-foreground opacity-50" />
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
      
      <div className="mt-auto">
        {!isAnalyzing ? (
          <Button 
            variant="default"
            onClick={startAnalysis}
            className="w-full flex items-center justify-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Start Detection</span>
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
