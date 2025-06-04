"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

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
  const [color, setColor] = useState("#000");
  const [brightness, setBrightness] = useState(100);

  const isMobile =
          typeof navigator !== "undefined" &&
          /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Mỗi màu nền phù hợp với màu chữ cùng index trong colorOptions
  // Đảm bảo độ tương phản tốt, dịu mắt cho người đọc truyện
  const bgOptions = [
    "#fff", // Trắng - phù hợp với chữ đen (#000)
    "#f7f7f7", // Xám sáng - phù hợp với chữ xám đậm (#333)
    "#f5e9da", // Kem nhạt - phù hợp với chữ nâu đậm (#4B3621)
    "#232946", // Xanh đen nhạt - phù hợp với chữ xanh đen (#1a1a2e)
    "#e0fbfc", // Xanh biển nhạt - phù hợp với chữ xanh biển đậm (#005f73)
    "#e5e7eb", // Xám xanh nhạt - phù hợp với chữ xám xanh (#374151)
    "#fff8f0", // Vàng kem - phù hợp với chữ nâu nhạt (#b08968)
    "#ffe5e9", // Hồng nhạt - phù hợp với chữ đỏ trầm (#e63946)
  ];
  const colorOptions = [
    "#000", // Đen - mặc định, dễ đọc trên nền sáng
    "#333", // Xám đậm - dịu mắt hơn
    "#4B3621", // Nâu đậm - phù hợp nền vàng/kem
    "#1a1a2e", // Xanh đen - dịu mắt ban đêm
    "#005f73", // Xanh biển đậm - dịu mắt
    "#374151", // Xám xanh - hiện đại, dễ đọc
    "#b08968", // Nâu nhạt - phù hợp nền sáng
    "#e63946", // Đỏ trầm - nổi bật, dùng cho người thích nổi bật
  ];
  const t = useTranslations("chapter");

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
          `/stories/${slug}/chapters/prev-and-next/${chapter.chapterNumber}`
        );

        setNextChapter(res.data.next || null);
        setPrevChapter(res.data.prev || null);
        if (isMobile && !res.data.next) {
          alert("Không thể tải chương tiếp theo. Vui lòng thử lại sau.");
        }
      } catch (error) {
        if (isMobile) {
          alert("Không thể tải chương tiếp theo. Vui lòng thử lại sau.");
        }
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

  if (loading) return <p className="p-4">{t("loading")}</p>;
  if (!chapter) return <p className="p-4">{t("not_found")}</p>;

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
          chapter={chapter}
          color={color}
          colorOptions={colorOptions}
          fontSize={fontSize}
          setBgColor={setBgColor}
          setBrightness={setBrightness}
          setColor={setColor}
          setFontSize={setFontSize}
        />
      </div>
      <h1
        dangerouslySetInnerHTML={{
          __html: chapter.title?.replace(/<\/?span[^>]*>/g, ""),
        }}
        className="text-xl font-bold text-center"
        style={{ fontSize, color }}
      />
      <div
        dangerouslySetInnerHTML={{
          __html: chapter.content.replace(/Tàng thư viện/gi, "Vô ưu các"),
        }}
        className="prose max-w-none whitespace-pre-wrap"
        style={{ fontSize, color }}
      />
      <div className="flex justify-end md:justify-between mt-10">
        {prevChapter && (
          <Link
            href={`/truyen/${slug}/chuong/${prevChapter.slug}`}
            passHref
            legacyBehavior
          >
            <Button className=" hidden md:block" size="sm" as="a">
              ← {t("prev")}
            </Button>
          </Link>
        )}
        <Link href={`/truyen/${slug}`} passHref legacyBehavior>
          <Button className="underline hidden md:block" size="sm" as="a">
            {t("chapter_list")}
          </Button>
        </Link>
        <Link
          href={`/truyen/${slug}/chuong/${nextChapter?.slug}`}
          passHref
          legacyBehavior
        >
          <Button size="sm" as="a">
            {t("next")} →
          </Button>
        </Link>
      </div>
    </div>
  );
}
