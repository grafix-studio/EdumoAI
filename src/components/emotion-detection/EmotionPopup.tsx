
import { X, Heart, Frown, HeartCrack, Timer } from "lucide-react";
import { useState, useEffect } from "react";

interface EmotionPopupProps {
  showEmotionPopup: boolean;
  popupEmotion: string | null;
  setShowEmotionPopup: (show: boolean) => void;
}

export default function EmotionPopup({ 
  showEmotionPopup, 
  popupEmotion, 
  setShowEmotionPopup 
}: EmotionPopupProps) {
  const [timeLeft, setTimeLeft] = useState(8);
  
  useEffect(() => {
    let timer: number | null = null;
    
    if (showEmotionPopup) {
      setTimeLeft(8);
      timer = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer!);
            setShowEmotionPopup(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showEmotionPopup, setShowEmotionPopup]);
  
  if (!showEmotionPopup || !popupEmotion) return null;
  
  return (
    <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg w-80 animate-in fade-in slide-in-from-right-5 duration-300
                    ${popupEmotion === "stressed" ? "bg-destructive/10 border border-destructive/30" : 
                      popupEmotion === "sad" ? "bg-warning/10 border border-warning/30" :
                      "bg-secondary/80 border border-border/50"}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {popupEmotion === "stressed" ? 
            <HeartCrack className="w-5 h-5 text-destructive" /> : 
            popupEmotion === "sad" ?
            <Frown className="w-5 h-5 text-warning" /> :
            <Heart className="w-5 h-5 text-primary" />
          }
          <h4 className="font-semibold text-lg">
            {popupEmotion === "stressed" ? "High Stress Detected" : 
             popupEmotion === "sad" ? "You seem a bit down" :
             `Detected: ${popupEmotion}`}
          </h4>
        </div>
        <button 
          onClick={() => setShowEmotionPopup(false)}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="text-sm mb-3">
        {popupEmotion === "stressed" 
          ? "Your stress levels appear high. Taking a short break can help reduce stress and improve learning outcomes." 
          : popupEmotion === "sad"
          ? "Your emotional state appears below neutral. A change of pace might help improve your mood and engagement."
          : `Your current emotional state is ${popupEmotion}. We'll adapt your learning experience accordingly.`}
      </p>
      <div className="text-sm font-medium flex items-center gap-2 text-primary">
        <Timer className="w-4 h-4" />
        <span>Closes in {timeLeft}s</span>
      </div>
      <div className="w-full bg-background/50 h-1 mt-2 rounded-full overflow-hidden">
        <div 
          className="bg-primary h-full transition-all duration-1000" 
          style={{ width: `${(timeLeft / 8) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
