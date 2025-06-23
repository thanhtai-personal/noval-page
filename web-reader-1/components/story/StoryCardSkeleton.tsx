import React from 'react';

const StoryCardSkeleton = () => {
  return (
    <div className="animate-pulse border border-gray-300 rounded-lg p-4">
      <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
      <div className="h-6 bg-gray-200 rounded-md mb-2"></div>
      <div className="h-4 bg-gray-200 rounded-md mb-2"></div>
      <div className="h-4 bg-gray-200 rounded-md mb-2"></div>
    </div>
  );
};

export default StoryCardSkeleton;