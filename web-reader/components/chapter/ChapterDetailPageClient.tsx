"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { ApiInstant } from "@/utils/api";
import { ReadingSettings } from "@/components/chapter/ReadingSettings";
import { observer } from "mobx-react-lite";
import { useAppStore } from "@/store/Provider";
import { isMobile } from "@/utils/funtions";
import { bgOptions, colorOptions } from "./constants";
import { useMarkAsReadTo } from "@/hooks/useMarkAsReadTo";
import SideLoading from "@/components/common/SideLoading/SideLoading";
import { useSnackbar } from "notistack";

// Fetch prev/next chapter
const fetchPrevNextChapter = async ({
  slug,
  chapterNumber,
}: {
  slug: string;
  chapterNumber: number;
}) => {
  const res = await ApiInstant.get(
    `/stories/${slug}/chapters/prev-and-next/${chapterNumber}`,
  );
  return res.data as { next: any | null; prev: any | null };
};

const fetchChapterContent = async ({
  slug,
  chapterSlug,
}: {
  slug: string;
  chapterSlug: string;
}) => {
  const res = await ApiInstant.get(
    `/stories/${slug}/chapters/${chapterSlug}/content`,
  );
  return res.data;
};

export const ChapterPageClient = observer(({ chapter }: any) => {
  const router = useRouter();
  const { slug } = useParams() as { slug: string };
  const [fontSize, setFontSize] = useState(20);
  const [bgColor, setBgColor] = useState("#fff");
  const [color, setColor] = useState("#000");
  const [brightness, setBrightness] = useState(100);

  const appStore = useAppStore();
  const t = useTranslations("chapter");
  const { enqueueSnackbar } = useSnackbar();

  // Side effect animation mode
  useEffect(() => {
    appStore.toggleAnimationMode(false);
    return () => {
      appStore.toggleAnimationMode(true);
    };
  }, []);

  // Query chapter content
  const {
    data: chapterContent,
    isLoading: loadingChapterContent,
    error: errorChapterContent,
  } = useQuery({
    queryKey: ["chapter-content", slug, chapter?.chapterNumber],
    queryFn: () =>
      fetchChapterContent({
        slug,
        chapterSlug: chapter.slug,
      }),
    enabled: !!slug && !!chapter?.slug,
  });

  // Query prev/next chapter
  const {
    data: prevNextData,
    isLoading: loadingPrevNext,
    error: errorPrevNext,
  } = useQuery({
    queryKey: ["prev-next-chapter", slug, chapter?.chapterNumber],
    queryFn: () =>
      fetchPrevNextChapter({
        slug,
        chapterNumber: chapter.chapterNumber,
      }),
    enabled: !!slug && !!chapter?.chapterNumber,
  });

  // SIDE EFFECT ALERT: dùng useEffect để bắt alert khi data hoặc error thay đổi
  useEffect(() => {
    if (prevNextData && isMobile() && !prevNextData.next) {
      enqueueSnackbar("Không thấy chương tiếp theo. Vui lòng thử lại sau.");
    }
  }, [prevNextData]);

  useEffect(() => {
    if (errorPrevNext && isMobile()) {
      enqueueSnackbar("Không thể tải chương tiếp theo. Vui lòng thử lại sau.");
    }
  }, [errorPrevNext]);

  const nextChapter = prevNextData?.next || null;
  const prevChapter = prevNextData?.prev || null;

  // Mobile swipe next chapter
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
    // eslint-disable-next-line
  }, [nextChapter]);

  useMarkAsReadTo(async () => {
    try {
      await ApiInstant.post(
        `/stories/${slug}/chapters/${chapter.slug}/mark-as-read`,
      );
    } catch (error) {}
  });

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
      {loadingChapterContent ? (
        <SideLoading />
      ) : chapterContent?.content ? (
        <div
          dangerouslySetInnerHTML={{
            __html: chapterContent.content.replace(
              /Tàng thư viện/gi,
              "Vô ưu các",
            ),
          }}
          className="prose max-w-none whitespace-pre-wrap"
          style={{ fontSize, color }}
        />
      ) : (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="mb-2">{t("chapter_loading")}</p>
            <a
              href={chapter.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600"
            >
              {t("watch_on_source")}
            </a>
          </div>
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
          href={
            nextChapter ? `/truyen/${slug}/chuong/${nextChapter?.slug}` : "#"
          }
        >
          <Button as="a" size="sm" disabled={!nextChapter}>
            {t("next")} →
          </Button>
        </Link>
      </div>
    </div>
  );
});

export default ChapterPageClient;
