"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { ApiInstant } from "@/utils/api";
import { Story } from "@/types/interfaces/story";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { StoriesWithSkeletonLoading } from "@/components/common/utils/StoriesWithSkeletonLoading";
import { Fire1Wrapper } from "@/components/animations/fires/Fire1Wrapper";
import { FireLineWrapper } from "@/components/animations/fires/FireLineWrapper";
import LazySlider from "./LazySlider";
import { StorySection } from "./StorySection";

export default function HomePageContent() {
  const t = useTranslations("home");
  const [topView, setTopView] = useState<Story[]>([]);
  const [topRecommend, setTopRecommend] = useState<Story[]>([]);
  const [topLike, setTopLike] = useState<Story[]>([]);
  const [topVote, setTopVote] = useState<Story[]>([]);
  const [topChapter, setTopChapter] = useState<Story[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const recommendRes = await ApiInstant.get(
        "/stories?sort=recommends&limit=8",
      );
      const viewRes = await ApiInstant.get("/stories?sort=views&limit=8");
      const voteRes = await ApiInstant.get("/stories?sort=votes&limit=5");
      const likeRes = await ApiInstant.get("/stories?sort=likes&limit=8");
      const chapterRes = await ApiInstant.get(
        "/stories?sort=totalChapters&limit=8",
      );

      setTopView(viewRes.data?.data || []);
      setTopRecommend(recommendRes.data?.data || []);
      setTopLike(likeRes.data?.data || []);
      setTopVote(voteRes.data?.data || []);
      setTopChapter(chapterRes.data?.data || []);
    };

    fetchData();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 1250,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <section className="container mx-auto px-4 py-8 space-y-12 overflow-visible">
      {/* Banner Slide */}
      <h1 className="text-3xl font-bold inline-flex items-center">
        <Fire1Wrapper
          width={60}
          height={60}
          id={"top-truyen-de-cu"}
          stopColor={"#8a00ff"}
          strokeColor={"#9fdbf7"}
          fill1={"#8c0168"}
          fill2={"#19020f"}
        />{" "}
        {t("top_recommend_title")}
      </h1>
      <div className="relative">
        <LazySlider sliderSettings={sliderSettings} dataList={topVote} />
        <FireLineWrapper />
      </div>

      <StorySection
        stories={topRecommend}
        titleIcon={
          <Fire1Wrapper
            width={40}
            height={60}
            id={"top-truyen-de-cu"}
            stopColor={"#8a00ff"}
            strokeColor={"#9fdbf7"}
            fill1={"#8c0168"}
            fill2={"#19020f"}
          />
        }
        title={t("most_recommended")}
        className="mt-10 md:mt-20"
      />

      <StorySection
        stories={topView}
        title={t("most_viewed")}
        className="mt-10"
      />

      <StorySection
        stories={topLike}
        title={t("most_liked")}
        className="mt-10"
      />

      <StorySection
        stories={topChapter}
        title={t("longest")}
        className="mt-10"
      />
    </section>
  );
}
