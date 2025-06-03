import { Metadata } from "next";

import { ApiInstant } from "@/utils/api";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug, index } = params;
  const res = await ApiInstant.get(`/stories/${slug}/chapters/${index}`);
  const chapter = res.data;

  return {
    title: `${chapter.title} - Đọc truyện ${chapter.story.title} | Vô Ưu Các`,
    description: chapter.content?.replace(/<[^>]+>/g, "").slice(0, 160),
  };
}
