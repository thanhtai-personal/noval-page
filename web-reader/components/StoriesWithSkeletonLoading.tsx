'use client';

import { Story } from '@/types/interfaces/story';
import { StoryCard } from './StoryCard';
import { StoryCardSkeleton } from './StoryCardSkeleton';

export function StoriesWithSkeletonLoading({
  stories,
  skeletonCount = 4,
  isSlide = false,
}: {
  stories: Story[];
  skeletonCount?: number;
  isSlide?: boolean;
}) {
  const isLoading = !stories || stories.length === 0;

  return (
    <>
      {(isLoading
        ? Array.from({ length: skeletonCount })
        : stories
      ).map((story: any, i: number) =>
        story ? (
          <StoryCard key={story._id} story={story} isSlide={isSlide} />
        ) : (
          <StoryCardSkeleton key={`skeleton-${i}`} />
        )
      )}
    </>
  );
}
