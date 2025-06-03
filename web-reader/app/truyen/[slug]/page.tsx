import { Metadata } from "next";
import { notFound } from "next/navigation";
// import { useTranslations } from "next-intl";

import { ApiInstant } from "@/utils/api";
import { Story } from "@/types/interfaces/story";
import { StoryDetailClient } from "@/components/story/StoryDetailClient";

async function fetchStory(slug: string): Promise<any | null> {
  try {
    const res = await ApiInstant.get(`/stories/${slug}`);

    return res.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const story = await fetchStory((await params).slug);

  return {
    title: story?.title || "Chi tiết truyện",
    description: story?.introduce,
  };
}

export default async function StoryDetailPage({ params }: any) {
  let story: Story;

  try {
    story = await fetchStory((await params).slug);
    if (!story) return notFound();
  } catch (error) {
    return notFound();
  }

  return <StoryDetailClient story={story} />;
}
