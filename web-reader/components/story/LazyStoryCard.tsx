import { Story } from "@/types/interfaces/story";
import { StoryCard } from "./StoryCard";
import { StoryCardSkeleton } from "./StoryCardSkeleton";
import { useInView } from "react-intersection-observer";

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
        <StoryCard story={story} isSlide={isSlide} />
      ) : (
        <StoryCardSkeleton />
      )}
    </div>
  );
}

export default LazyStoryCard;
