import { Badge } from "@heroui/badge";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";

import { ApiInstant } from "@/utils/api";
import { Story } from "@/types/interfaces/story";
import { StoryTabs } from "@/components/story/StoryTabs";
import { LastReadChapter } from "@/components/chapter/LastReadChapter";

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

  const t = useTranslations("story");

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          alt={story.title}
          className="w-full max-w-xs object-cover rounded shadow"
          src={story.cover}
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{story.title}</h1>
          <p className="text-default-600 mb-2">
            {t("author")}: {story.author?.name || t("unknown")}
          </p>
          <div className="flex gap-2 flex-wrap mb-2">
            {story.categories?.map((c: any) => (
              <Badge key={c.name} color="primary">
                {c.name}
              </Badge>
            ))}
            {story.tags?.map((t: any) => (
              <Badge key={t.name} color="secondary">
                {t.name}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-default-700 mb-2">
            {t("total_chapters")}: {story.totalChapters}
          </p>
          <p className="text-sm text-default-700 mb-2">
            {t("source")}: {story.source?.name}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {t("views")}: {story.views} | {t("likes")}: {story.likes} |{" "}
            {t("recommends")}: {story.recommends} | {t("votes")}: {story.votes}
          </p>
          <h1 className="text-3xl font-bold mb-2">{story.title}</h1>
          <LastReadChapter slug={story.slug} />

          <h3 className="text-xl font-semibold mb-2 underline mt-10">
            {t("intro")}
          </h3>
          <div
            dangerouslySetInnerHTML={{
              __html: story.intro || `<i>${t("not_updated")}</i>`,
            }}
            className="text-default-700 whitespace-pre-wrap"
          />
        </div>
      </div>

      <StoryTabs
        description={story.description}
        slug={story.slug}
        storyId={story._id}
        storySlug={story.slug}
      />
    </section>
  );
}
