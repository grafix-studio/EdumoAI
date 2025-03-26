import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const StressAlert: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed top-4 right-4 bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-lg max-w-md animate-fade-in">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">High Stress Detected</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>Your stress levels appear to be elevated. Consider taking a short break or trying some breathing exercises.</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="ml-4 flex-shrink-0 inline-flex text-red-500 hover:text-red-700 focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default StressAlert;