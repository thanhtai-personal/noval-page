"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/button";

import { ApiInstant } from "@/utils/api";
import { ReadingSettings } from "@/components/chapter/ReadingSettings";

export default function ChapterPage() {
  const { slug, index } = useParams();
  const router = useRouter();
  const [chapter, setChapter] = useState<any>(null);
  const [nextChapter, setNextChapter] = useState<any>(null);
  const [prevChapter, setPrevChapter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(20);
  const [bgColor, setBgColor] = useState("#fff");
  const [brightness, setBrightness] = useState(100);
  const bgOptions = [
    "#fff",
    "#f7f7f7",
    "#fbeee6",
    "#e6f7fb",
    "#222",
    "#111",
    "#f5f5dc",
    "#f0e6fa",
  ];

  const loadChapter = useCallback(async () => {
    setLoading(true);
    const res = await ApiInstant.get(`/stories/${slug}/chapters/${index}`);

    setChapter(res.data);
    localStorage.setItem(`read-${slug}-${slug}`, index?.toString() || "0");
    setLoading(false);
  }, [slug, index]);

  useEffect(() => {
    loadChapter();
  }, []);

  useEffect(() => {
    if (!chapter) return;
    const fetchNextChapter = async () => {
      try {
        const res = await ApiInstant.get(
          `/stories/${slug}/chapters/prev-and-next/${chapter.chapterNumber}`,
        );

        setNextChapter(res.data.next || null);
        setPrevChapter(res.data.prev || null);
      } catch (error) {
        console.error("Error fetching next chapter:", error);
      }
    };

    fetchNextChapter();
  }, [chapter]);

  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      const dx = touchEndX - touchStartX;

      if (dx < -100) handleNext();
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [index, slug]);

  const handleNext = () => {
    if (!nextChapter) return;
    router.push(`/truyen/${slug}/chuong/${nextChapter.slug}`);
  };

  const handleBack = () => {
    router.push(`/truyen/${slug}/chuong/${prevChapter.slug}`);
  };

  const handleBackToList = () => {
    router.push(`/truyen/${slug}`);
  };

  if (loading) return <p className="p-4">Đang tải chương...</p>;
  if (!chapter) return <p className="p-4">Không tìm thấy chương.</p>;

  return (
    <div
      className="max-w-3xl mx-auto px-4 py-6 space-y-4"
      style={{ background: bgColor, filter: `brightness(${brightness}%)` }}
    >
      <div className="mb-6">
        <ReadingSettings
          bgColor={bgColor}
          bgOptions={bgOptions}
          brightness={brightness}
          fontSize={fontSize}
          setBgColor={setBgColor}
          setBrightness={setBrightness}
          setFontSize={setFontSize}
        />
      </div>
      <h1
        dangerouslySetInnerHTML={{
          __html: chapter.title?.replace(/<\/?span[^>]*>/g, ""),
        }}
        className="text-xl font-bold text-center"
        style={{ fontSize }}
      />
      <div
        dangerouslySetInnerHTML={{ __html: chapter.content }}
        className="prose max-w-none whitespace-pre-wrap"
        style={{ fontSize }}
      />
      <div className="flex justify-end md:justify-between mt-10">
        {prevChapter && (
          <Button className=" hidden md:block" size="sm" onClick={handleBack}>
            ← Chương trước
          </Button>
        )}
        <Button
          className="underline hidden md:block"
          size="sm"
          onClick={handleBackToList}
        >
          Danh sách chương
        </Button>
        <Button size="sm" onClick={handleNext}>
          Chương tiếp →
        </Button>
      </div>
    </div>
  );
}
