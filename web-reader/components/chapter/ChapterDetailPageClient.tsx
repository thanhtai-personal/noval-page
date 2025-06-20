"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { ApiInstant } from "@/utils/api";
import { ReadingSettings } from "@/components/chapter/ReadingSettings";
import { observer } from "mobx-react-lite";
import { useAppStore } from "@/store/Provider";
import { isMobile } from "@/utils/funtions";
import { bgOptions, colorOptions } from "./constants";

export const ChapterPageClient = observer(({ chapter }: any) => {
  const router = useRouter();
  const { slug } = useParams();
  const [nextChapter, setNextChapter] = useState<any>(null);
  const [prevChapter, setPrevChapter] = useState<any>(null);
  const [fontSize, setFontSize] = useState(20);
  const [bgColor, setBgColor] = useState("#fff");
  const [color, setColor] = useState("#000");
  const [brightness, setBrightness] = useState(100);

  const appStore = useAppStore();

  const t = useTranslations("chapter");

  useEffect(() => {
    appStore.toggleAnimationMode(false);

    return () => {
      appStore.toggleAnimationMode(true);
    };
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
        if (isMobile() && !res.data.next) {
          alert("Không thấy chương tiếp theo. Vui lòng thử lại sau.");
        }
      } catch (error) {
        if (isMobile()) {
          alert("Không thể tải chương tiếp theo. Vui lòng thử lại sau.");
        }
        console.error("Error fetching next chapter:", error);
      }
    };

    fetchNextChapter();
  }, [chapter?.slug, chapter?.chapterNumber]);

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
  }, []);

  const handleNext = () => {
    if (!nextChapter) return;
    router.push(`/truyen/${chapter?.slug}/chuong/${nextChapter?.slug}`);
  };

  if (!chapter) return <p className="p-4">{t("not_found")}</p>;

  return (
    <div
      className="max-w-3xl mx-auto px-4 py-6 my-10 space-y-4 rounded-sm"
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
      {chapter.content ? (
        <div
          dangerouslySetInnerHTML={{
            __html: chapter.content?.replace(/Tàng thư viện/gi, "Vô ưu các"),
          }}
          className="prose max-w-none whitespace-pre-wrap"
          style={{ fontSize, color }}
        />
      ) : (
        <div className="w-full h-screen">
          <iframe
            title="source-chapter"
            className="w-full h-full"
            src={chapter.url}
          />
        </div>
      )}
      <div className="flex justify-end md:justify-between mt-10">
        {prevChapter && (
          <Link
            legacyBehavior
            passHref
            href={`/truyen/${slug}/chuong/${prevChapter.slug}`}
          >
            <Button as="a" className=" hidden md:block" size="sm">
              ← {t("prev")}
            </Button>
          </Link>
        )}
        <Link legacyBehavior passHref href={`/truyen/${slug}`}>
          <Button as="a" className="text-center" size="sm">
            {t("chapter_list")}
          </Button>
        </Link>
        <Link
          legacyBehavior
          passHref
          href={`/truyen/${slug}/chuong/${nextChapter?.slug}`}
        >
          <Button as="a" size="sm">
            {t("next")} →
          </Button>
        </Link>
      </div>
    </div>
  );
});
