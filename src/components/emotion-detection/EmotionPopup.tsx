
import { X, Heart, Frown, HeartCrack, Timer } from "lucide-react";

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
  if (!showEmotionPopup || !popupEmotion) return null;
  
  return (
    <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg w-80 
                    ${popupEmotion === "stressed" ? "bg-destructive/10 border border-destructive/30" : 
                      popupEmotion === "sad" ? "bg-warning/10 border border-warning/30" :
                      "bg-secondary/10 border border-secondary/30"}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {popupEmotion === "stressed" ? 
            <HeartCrack className="w-5 h-5 text-destructive" /> : 
            popupEmotion === "sad" ?
            <Frown className="w-5 h-5 text-warning" /> :
            <Timer className="w-5 h-5 text-secondary-foreground" />
          }
          <h4 className="font-semibold text-lg">
            {popupEmotion === "stressed" ? "High Stress Detected" : 
             popupEmotion === "sad" ? "You seem a bit down" :
             "Emotional State Changed"}
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
          : "Your emotional state has changed. The system has updated your learning recommendations accordingly."}
      </p>
      <div className="text-sm font-medium flex items-center gap-2 text-primary">
        <Heart className="w-4 h-4" />
        <span>
          {popupEmotion === "stressed" 
            ? "Try a 2-minute breathing exercise" 
            : popupEmotion === "sad"
            ? "Consider a quick positive visualization"
            : "Check your updated recommendations"}
        </span>
      </div>
    </div>
  );
}
