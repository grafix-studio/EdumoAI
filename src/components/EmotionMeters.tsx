import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, ArrowDown } from 'lucide-react';
import { useEmotionStore } from '../store/emotionStore';

const EmotionMeters: React.FC = () => {
  const isDarkMode = useEmotionStore((state) => state.isDarkMode);
  const emotions = useEmotionStore((state) => state.emotions);
  const lastEmotion = emotions[emotions.length - 1];

  const [currentStressLevel, setCurrentStressLevel] = useState(0);
  const [currentConfidence, setCurrentConfidence] = useState(0);
  const [showStressAlert, setShowStressAlert] = useState(false);

  const stressReliefTips = [
    "Take deep breaths - inhale for 4 seconds, hold for 4, exhale for 4",
    "Stand up and stretch for a few minutes",
    "Take a short break and drink some water",
    "Try the 5-4-3-2-1 grounding technique",
    "Close your eyes and practice mindfulness for 2 minutes"
  ];

  const getEmotionColor = (value: number) => {
    if (value > 70) return 'bg-red-500';
    if (value > 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const scrollToMindActivities = () => {
    const element = document.querySelector('#mind-activities');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (lastEmotion) {
      const stressInterval = setInterval(() => {
        setCurrentStressLevel((prev) => {
          const diff = lastEmotion.stress_level - prev;
          if (Math.abs(diff) < 0.5) return lastEmotion.stress_level;
          return prev + diff * 0.1;
        });
      }, 50);

      const confidenceInterval = setInterval(() => {
        setCurrentConfidence((prev) => {
          const diff = lastEmotion.confidence - prev;
          if (Math.abs(diff) < 0.5) return lastEmotion.confidence;
          return prev + diff * 0.1;
        });
      }, 50);

      if (lastEmotion.stress_level > 70 && !showStressAlert) {
        setShowStressAlert(true);
        setTimeout(() => setShowStressAlert(false), 15000);
      }

      return () => {
        clearInterval(stressInterval);
        clearInterval(confidenceInterval);
      };
    }
  }, [lastEmotion]);

  return (
    <>
      {/* Stress Alert Popup */}
      {showStressAlert && (
        <div className="fixed top-4 right-4 max-w-md z-50 animate-slide-in">
          <div
            className={`${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-lg shadow-lg border ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium mb-2">High Stress Level Detected</h4>
                    <p className="text-sm mb-2">Try these stress relief techniques:</p>
                    <ul className="text-sm list-disc list-inside space-y-1 mb-4">
                      {stressReliefTips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                    <button
                      onClick={scrollToMindActivities}
                      className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <ArrowDown className="w-4 h-4" />
                      Check Mind Activities below for more exercises
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setShowStressAlert(false)}
                  className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emotion Meters */}
      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <h3 className="font-semibold mb-4">Emotion Indicators</h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Stress Level</span>
              <span className="text-sm">{currentStressLevel.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className={`h-2.5 rounded-full ${getEmotionColor(currentStressLevel)} transition-all duration-300`}
                style={{ width: `${currentStressLevel}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Confidence</span>
              <span className="text-sm">{currentConfidence.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="h-2.5 rounded-full bg-blue-500 transition-all duration-300"
                style={{ width: `${currentConfidence}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Current Emotion</h4>
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <span className="text-lg font-semibold">
                {lastEmotion?.emotion || 'Analyzing...'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmotionMeters;
