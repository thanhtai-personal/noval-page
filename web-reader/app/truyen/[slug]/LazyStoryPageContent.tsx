"use client";

import dynamic from "next/dynamic";

const StoryDetailClient = dynamic(
  () => import("@/components/story/StoryDetailClient"),
  {
    ssr: false,
  },
);

const LazyStoryPageContent = (props: any) => {
  return <StoryDetailClient {...props} />;
};

export default LazyStoryPageContent;
