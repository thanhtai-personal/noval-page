"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Badge } from "@heroui/badge";
import { Button } from "@heroui/button";
import Link from "next/link";
import { ApiInstant } from "@/utils/api";
import { Story } from "@/types/interfaces/story";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

  const renderStoryCard = (story: Story, isSlide: boolean = false) => (
    <Card key={story._id}>
      <CardHeader className="p-0">
        <img
          src={story.cover}
          alt={story.title}
          className={isSlide ? `w-auto h-[calc(100vh/2.8)] object-cover rounded-t mx-auto` : `w-full h-48 object-cover rounded-t`}
        />
      </CardHeader>
      <CardBody>
        <h2 className="text-lg font-semibold">{story.title}</h2>
        <p className="text-sm text-gray-600 mb-1">
          Tác giả: {story.author?.name}
        </p>
        <div
          className="text-sm text-gray-600"
          dangerouslySetInnerHTML={{ __html: story.intro }}
        />
        <div className="flex flex-wrap gap-1 mt-2">
          {story.categories.map((cat) => (
            <Badge key={cat.slug} variant="flat" color="primary">
              {cat.name}
            </Badge>
          ))}
          {story.tags.map((tag) => (
            <Badge key={tag.name} variant="flat" color="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>
        <div className="mt-2 text-xs text-gray-500 space-y-1">
          <p>👁️ Lượt đọc: {story.views}</p>
          <p>📖 Số chương: {story.totalChapters}</p>
          <p>
            🌟 Bình chọn: {story.votes} | ❤️ Yêu thích: {story.likes} | 📌 Đề
            cử: {story.recommends}
          </p>
        </div>
      </CardBody>
      <CardFooter>
        <Link href={`/truyen/${story.slug}`}>
          <Button size="sm" variant="flat" color="primary">
            Đọc ngay
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );

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
            <div key={story._id} className="px-2">
              {renderStoryCard(story, true)}
            </div>
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
          {topRecommend.map((s) => renderStoryCard(s))}
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
          {topView.map((s) => renderStoryCard(s))}
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
          {topLike.map((s) => renderStoryCard(s))}
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
          {topChapter.map((s) => renderStoryCard(s))}
        </div>
      </div>
    </section>
  );
}
