import { Story } from "@/types/interfaces/story";
import { ApiInstant } from "@/utils/api";
import { Badge } from "@heroui/badge";
import { Card, CardBody } from "@heroui/card";
import { Metadata } from "next";
import { notFound } from "next/navigation";

async function fetchStory(slug: string): Promise<any | null> {
  try {
    const res = await ApiInstant.get(`/stories/${slug}`);
    return res || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const story = await fetchStory((await params).slug);
  return {
    title: story?.title || "Chi tiết truyện",
    description: story?.description,
  };
}

export default async function StoryDetailPage({ params }: any) {
  let story;
  try {
    story = await fetchStory((await params).slug);
    if (!story) return notFound();
  } catch (error) {
    return notFound();
  }

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={story.cover}
          alt={story.title}
          className="w-full max-w-xs object-cover rounded shadow"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{story.title}</h1>
          <p className="text-gray-600 mb-2">
            Tác giả: {story.author?.name || "Không rõ"}
          </p>
          <div className="flex gap-2 flex-wrap mb-2">
            {story.categories.map((c) => (
              <Badge key={c.name} color="primary">
                {c.name}
              </Badge>
            ))}
            {story.tags.map((t) => (
              <Badge key={t.name} color="secondary">
                {t.name}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-gray-700 mb-2">
            Tổng chương: {story.totalChapters}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            Nguồn: {story.source?.title}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            Lượt xem: {story.views} | Lượt thích: {story.likes} | Đề cử:{" "}
            {story.recommends} | Bình chọn: {story.votes}
          </p>
        </div>
      </div>

      <Card className="mt-6">
        <CardBody>
          <h2 className="text-xl font-semibold mb-2">Mô tả</h2>
          <p className="text-gray-800">{story.description}</p>
          {story.intro && (
            <>
              <h3 className="text-lg font-medium mt-4 mb-2">Giới thiệu</h3>
              <p className="text-gray-700">{story.intro}</p>
            </>
          )}
        </CardBody>
      </Card>
    </section>
  );
}
