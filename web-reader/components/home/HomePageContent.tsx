"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import Link from "next/link";
import Slider from "react-slick";
import { useTranslations } from "next-intl";

import { ApiInstant } from "@/utils/api";
import { Story } from "@/types/interfaces/story";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { StoriesWithSkeletonLoading } from "@/components/common/utils/StoriesWithSkeletonLoading";
import { StoryCard } from "@/components/story/StoryCard";
import { StoryCardSkeleton } from "@/components/story/StoryCardSkeleton";
import { Fire1 } from "@/components/animations/fires/Fire1";
import FireLine from "@/components/animations/fires/FireLine";

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
        <Fire1
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
        <Slider {...sliderSettings}>
          {(!topVote || topVote.length === 0
            ? Array.from({ length: 4 })
            : topVote
          ).map((story: any, i: number) =>
            story ? (
              <StoryCard key={story._id} isSlide story={story} />
            ) : (
              <StoryCardSkeleton key={`skeleton-${i}`} />
            ),
          )}
        </Slider>
        <FireLine />
      </div>

      {/* Đề cử nhiều */}
      <div className="mt-10 md:mt-20">
        <div className="relative flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold inline-flex items-center">
            <Fire1
              width={40}
              height={60}
              id={"top-truyen-de-cu"}
              stopColor={"#8a00ff"}
              strokeColor={"#9fdbf7"}
              fill1={"#8c0168"}
              fill2={"#19020f"}
            />{" "}
            {t("most_recommended")}
          </h2>
          <Link href="/search?sort=recommends">
            <Button size="sm" variant="light">
              {t("see_more")}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <StoriesWithSkeletonLoading stories={topRecommend} />
        </div>
      </div>

      {/* Nhiều lượt đọc */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">📚 {t("most_viewed")}</h2>
          <Link href="/search?sort=views">
            <Button size="sm" variant="light">
              {t("see_more")}
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <StoriesWithSkeletonLoading stories={topView} />
        </div>
      </div>

      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">📚 {t("most_liked")}</h2>
          <Link href="/search?sort=views">
            <Button size="sm" variant="light">
              {t("see_more")}
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <StoriesWithSkeletonLoading stories={topLike} />
        </div>
      </div>

      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">📚 {t("longest")}</h2>
          <Link href="/search?sort=views">
            <Button size="sm" variant="light">
              {t("see_more")}
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <StoriesWithSkeletonLoading stories={topChapter} />
        </div>
      </div>
    </section>
  );
}
