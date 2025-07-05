import { useInView } from "react-intersection-observer";

import { StoryCard } from "./StoryCard";
import { StoryCardSkeleton } from "./StoryCardSkeleton";

import { Story } from "@/types/interfaces/story";

function LazyStoryCard({
  story,
  isSlide,
}: {
  story: Story;
  isSlide?: boolean;
}) {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <div ref={ref}>
      {inView ? (
        <StoryCard isSlide={isSlide} story={story} />
      ) : (
        <StoryCardSkeleton />
      )}
    </div>
  );
}

export default LazyStoryCard;
