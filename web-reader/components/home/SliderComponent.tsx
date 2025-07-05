import Slider from "react-slick";

import LazyStoryCard from "@/components/story/LazyStoryCard";
import { StoryCardSkeleton } from "@/components/story/StoryCardSkeleton";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const SliderComponent = ({ sliderSettings = {}, dataList }: any) => {
  return (
    <Slider {...sliderSettings}>
      {(!dataList || dataList.length === 0
        ? Array.from({ length: 4 })
        : dataList
      ).map((story: any, i: number) =>
        story ? (
          <LazyStoryCard key={story._id} isSlide story={story} />
        ) : (
          <StoryCardSkeleton key={`skeleton-${i}`} />
        ),
      )}
    </Slider>
  );
};

export default SliderComponent;
