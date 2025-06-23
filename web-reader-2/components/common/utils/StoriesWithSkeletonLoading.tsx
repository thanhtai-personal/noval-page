import React from 'react';
import { Story } from '@/types/interfaces/story';
import { StoryCard } from '@/components/story/StoryCard';
import { StoryCardSkeleton } from '@/components/story/StoryCardSkeleton';

interface StoriesWithSkeletonLoadingProps {
  stories: Story[];
}

export const StoriesWithSkeletonLoading: React.FC<StoriesWithSkeletonLoadingProps> = ({ stories }) => {
  return (
    <>
      {stories.length === 0
        ? Array.from({ length: 4 }).map((_, i) => <StoryCardSkeleton key={`skeleton-${i}`} />)
        : stories.map((story) => <StoryCard key={story._id} story={story} />)}
    </>
  );
};