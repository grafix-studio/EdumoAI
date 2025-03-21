
import { X, Heart, Frown, HeartCrack } from "lucide-react";

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
    <div className={`emotion-popup ${popupEmotion === "stressed" ? "emotion-popup-stressed" : "emotion-popup-sad"}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {popupEmotion === "stressed" ? 
            <HeartCrack className="w-5 h-5 text-destructive" /> : 
            <Frown className="w-5 h-5 text-warning" />
          }
          <h4 className="font-semibold text-lg">
            {popupEmotion === "stressed" ? "Stress Detected" : "You seem a bit down"}
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
          ? "Taking a short break can help reduce stress levels and improve learning outcomes." 
          : "A change of pace might help improve your mood and engagement."}
      </p>
      <div className="text-sm font-medium flex items-center gap-2 text-primary">
        <Heart className="w-4 h-4" />
        <span>
          {popupEmotion === "stressed" 
            ? "Try a 2-minute breathing exercise" 
            : "Consider a quick positive visualization"}
        </span>
      </div>
    </div>
  );
}
