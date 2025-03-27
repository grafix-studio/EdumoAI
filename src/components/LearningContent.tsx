import React from 'react';
import { Book, Brain, Coffee, Lightbulb } from 'lucide-react';
import { useEmotionStore } from '../store/emotionStore';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  difficulty: 'easy' | 'medium' | 'hard';
}

const learningModules: LearningModule[] = [
  {
    id: 'basics',
    title: 'Fundamentals',
    description: 'Master the basic concepts at your own pace',
    icon: <Book className="w-6 h-6" />,
    difficulty: 'easy'
  },
  {
    id: 'advanced',
    title: 'Advanced Topics',
    description: 'Dive deep into complex subjects',
    icon: <Brain className="w-6 h-6" />,
    difficulty: 'hard'
  },
  {
    id: 'practice',
    title: 'Practice Exercises',
    description: 'Apply your knowledge with hands-on exercises',
    icon: <Coffee className="w-6 h-6" />,
    difficulty: 'medium'
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'Build real-world applications',
    icon: <Lightbulb className="w-6 h-6" />,
    difficulty: 'hard'
  }
];

const LearningContent: React.FC = () => {
  const isDarkMode = useEmotionStore((state) => state.isDarkMode);
  const emotions = useEmotionStore((state) => state.emotions);
  const lastEmotion = emotions[emotions.length - 1];

  const getRecommendedModules = () => {
    if (!lastEmotion) return learningModules;

    // Adjust recommendations based on stress level
    if (lastEmotion.stress_level > 70) {
      return learningModules.filter(module => module.difficulty === 'easy');
    } else if (lastEmotion.stress_level > 40) {
      return learningModules.filter(module => module.difficulty !== 'hard');
    }
    return learningModules;
  };

  const recommendedModules = getRecommendedModules();

  return (
    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <h3 className="font-semibold mb-4 text-lg">Learning Modules</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendedModules.map((module) => (
          <div
            key={module.id}
            className={`p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
            } transition-colors cursor-pointer`}
          >
            <div className="flex items-center gap-3 mb-2">
              {module.icon}
              <h4 className="font-medium">{module.title}</h4>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {module.description}
            </p>
            <div className="mt-2">
              <span
                className={`text-xs px-2 py-1 rounded ${
                  module.difficulty === 'easy'
                    ? 'bg-green-100 text-green-800'
                    : module.difficulty === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {module.difficulty}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningContent;