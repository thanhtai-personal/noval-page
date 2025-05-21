"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import Link from "next/link";
import { ApiInstant } from "@/utils/api";
import { Story } from "@/types/interfaces/story";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { StoryCard } from "@/components/StoryCard";

export default function HomePage() {
  const [topView, setTopView] = useState<Story[]>([]);
  const [topRecommend, setTopRecommend] = useState<Story[]>([]);
  const [topLike, setTopLike] = useState<Story[]>([]);
  const [topVote, setTopVote] = useState<Story[]>([]);
  const [topChapter, setTopChapter] = useState<Story[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const recommendRes = await ApiInstant.get(
        "/stories?sort=recommends&limit=10"
      );
      const viewRes = await ApiInstant.get("/stories?sort=views&limit=10");
      const voteRes = await ApiInstant.get("/stories?sort=votes&limit=5");
      const likeRes = await ApiInstant.get("/stories?sort=likes&limit=10");
      const chapterRes = await ApiInstant.get(
        "/stories?sort=totalChapters&limit=10"
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
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <section className="container mx-auto px-4 py-8 space-y-12">
      {/* Banner Slide */}
      <div>
        <h1 className="text-3xl font-bold mb-4">🔥 Top Truyện Đề Cử</h1>
        <Slider {...sliderSettings}>
          {topVote.map((story) => (
            <StoryCard key={story._id} story={story} isSlide />
          ))}
        </Slider>
      </div>

      {/* Đề cử nhiều */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">📌 Truyện Đề Cử Nhiều</h2>
          <Link href="/search?sort=recommends">
            <Button size="sm" variant="light">
              Xem thêm
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {topRecommend.map((story) => (
            <StoryCard key={story._id} story={story} />
          ))}
        </div>
      </div>

      {/* Nhiều lượt đọc */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">📚 Truyện Đọc Nhiều</h2>
          <Link href="/search?sort=views">
            <Button size="sm" variant="light">
              Xem thêm
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {topView.map((story) => (
            <StoryCard key={story._id} story={story} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">📚 Truyện nhiều yêu thích</h2>
          <Link href="/search?sort=views">
            <Button size="sm" variant="light">
              Xem thêm
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {topLike.map((story) => (
            <StoryCard key={story._id} story={story} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">📚 Truyện dài nhất</h2>
          <Link href="/search?sort=views">
            <Button size="sm" variant="light">
              Xem thêm
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {topChapter.map((story) => (
            <StoryCard key={story._id} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}
