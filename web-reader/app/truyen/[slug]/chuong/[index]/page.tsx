import { ChapterPageClient } from "@/components/chapter/ChapterDetailPageClient";
import { ApiInstant } from "@/utils/api";
import { Metadata } from "next";
import { notFound } from "next/navigation";

async function getChapter(
  storySlug: string,
  chapterSlug: string
): Promise<any | null> {
  try {
    const res = await ApiInstant.get(
      `/stories/${storySlug}/chapters/${chapterSlug}`
    );
    return res.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug: storySlug, index: chapterSlug } = await params;
  try {
    const chapter = await getChapter(storySlug, chapterSlug);
    return {
      title: `${chapter.title} - Đọc truyện ${chapter.story.title} | Vô Ưu Các`,
      description: chapter.content?.replace(/<[^>]+>/g, "").slice(0, 160),
    };
  } catch {
    return {
      title: "Không tìm thấy chương truyện",
      description: "Chương truyện không tồn tại hoặc đã bị xóa.",
    };
  }
}

export default async function ChapterDetailPage({ params }: any) {
  try {
    const { slug: storySlug, index: chapterSlug } = await params;
    const chapter = await getChapter(storySlug, chapterSlug);
    if (!chapter) return notFound();
    return <ChapterPageClient chapter={chapter} />;
  } catch (error) {
    return notFound();
  }
}
