import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { EmotionData } from '../types/emotion'; // Ensure the correct import

interface Props {
  emotionHistory: EmotionData[];
}

export const EmotionHistory: React.FC<Props> = ({ emotionHistory }) => {
  const formatData = (data: EmotionData[]) => {
    return data.map(entry => ({
      ...entry,
      time: new Date(entry.timestamp).toLocaleTimeString(),
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <div className="w-full overflow-x-auto">
        <LineChart width={600} height={300} data={formatData(emotionHistory)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="confidence" stroke="#8884d8" />
          <Line type="monotone" dataKey="stress_level" stroke="#82ca9d" />
        </LineChart>
      </div>
    </div>
  );
};

export default EmotionHistory;