import { Metadata } from "next";
import { notFound } from "next/navigation";

import { ApiInstant } from "@/utils/api";
import { Story } from "@/types/interfaces/story";
import dynamic from "next/dynamic";

const StoryDetailClient = dynamic(
  () => import("@/components/story/StoryDetailClient")
);

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

export const revalidate = 600; // 10 phút

export async function generateStaticParams() {
  // Gọi API lấy top 100 truyện nhiều lượt đọc nhất
  try {
    const res = await ApiInstant.get("/stories?limit=100&sort=-views");
    const stories = res.data || [];
    return stories.map((story: any) => ({ slug: story.slug }));
  } catch {
    return [];
  }
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
