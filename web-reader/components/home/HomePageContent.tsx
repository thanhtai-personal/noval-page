"use client";

import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";

import LazySlider from "./LazySlider";
import { StorySection } from "./StorySection";

import { Story } from "@/types/interfaces/story";
import { Fire1Wrapper } from "@/components/animations/fires/Fire1Wrapper";
import { FireLineWrapper } from "@/components/animations/fires/FireLineWrapper";
import { ApiInstant } from "@/utils/api";
import SideLoading from "@/components/common/SideLoading/SideLoading";

const fetchStories =
  (sort: string, limit: number) => async (): Promise<Story[]> => {
    const res = await ApiInstant.get(`/stories?sort=${sort}&limit=${limit}`);

    return res.data?.data || [];
  };

export default function HomePageContent() {
  const t = useTranslations("home");

  // Query: top recommend
  const { data: topRecommend = [], isLoading: loadingRecommend } = useQuery<
    Story[]
  >({
    queryKey: ["stories", "recommend", 8],
    queryFn: fetchStories("recommends", 8),
  });

  // Query: top view
  const { data: topView = [], isLoading: loadingView } = useQuery<Story[]>({
    queryKey: ["stories", "views", 8],
    queryFn: fetchStories("views", 8),
  });

  // Query: top like
  const { data: topLike = [], isLoading: loadingLike } = useQuery<Story[]>({
    queryKey: ["stories", "likes", 8],
    queryFn: fetchStories("likes", 8),
  });

  // Query: top vote
  const { data: topVote = [], isLoading: loadingVote } = useQuery<Story[]>({
    queryKey: ["stories", "votes", 5],
    queryFn: fetchStories("votes", 5),
  });

  // Query: top chapter
  const { data: topChapter = [], isLoading: loadingChapter } = useQuery<
    Story[]
  >({
    queryKey: ["stories", "totalChapters", 8],
    queryFn: fetchStories("totalChapters", 8),
  });

  const sliderSettings = {
    dots: false,
    infinite: true,
    autoplaySpeed: 5000,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    lazyLoad: "progressive",
  };

  if (loadingVote) {
    return <SideLoading />;
  }

  return (
    <section className="container mx-auto px-4 py-8 space-y-12 overflow-visible">
      {/* Banner Slide */}
      <h1 className="text-3xl font-bold inline-flex items-center">
        <Fire1Wrapper
          fill1={"#8c0168"}
          fill2={"#19020f"}
          height={60}
          id={"top-truyen-de-cu"}
          stopColor={"#8a00ff"}
          strokeColor={"#9fdbf7"}
          width={60}
        />{" "}
        {t("top_recommend_title")}
      </h1>
      <div className="relative">
        <LazySlider dataList={topVote} sliderSettings={sliderSettings} />
        <FireLineWrapper />
      </div>

      <StorySection
        className="mt-10 md:mt-20"
        loading={loadingRecommend}
        stories={topRecommend}
        title={t("most_recommended")}
        titleIcon={
          <Fire1Wrapper
            fill1={"#8c0168"}
            fill2={"#19020f"}
            height={60}
            id={"top-truyen-de-cu"}
            stopColor={"#8a00ff"}
            strokeColor={"#9fdbf7"}
            width={40}
          />
        }
      />

      <StorySection
        className="mt-10"
        loading={loadingView}
        stories={topView}
        title={t("most_viewed")}
      />

      <StorySection
        className="mt-10"
        loading={loadingLike}
        stories={topLike}
        title={t("most_liked")}
      />

      <StorySection
        className="mt-10"
        loading={loadingChapter}
        stories={topChapter}
        title={t("longest")}
      />
    </section>
  );
}
