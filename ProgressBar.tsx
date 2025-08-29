
import React from 'react';

interface ProgressBarProps {
  progress: number;
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, current, total }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-gray-300">Generating...</span>
        <span className="text-sm font-medium text-gray-300">{current} / {total} Images</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-4">
        <div
          className="bg-indigo-600 h-4 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
