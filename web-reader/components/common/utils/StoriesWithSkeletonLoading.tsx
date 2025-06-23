"use client";

import LazyStoryCard from "@/components/story/LazyStoryCard";
import { StoryCardSkeleton } from "../../story/StoryCardSkeleton";

import { Story } from "@/types/interfaces/story";

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
      {(isLoading ? Array.from({ length: skeletonCount }) : stories).map(
        (story: any, i: number) =>
          story ? (
            <LazyStoryCard key={story._id} isSlide={isSlide} story={story} />
          ) : (
            <StoryCardSkeleton key={`skeleton-${i}`} />
          ),
      )}
    </>
  );
}
