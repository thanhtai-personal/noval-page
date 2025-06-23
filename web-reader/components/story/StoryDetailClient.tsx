// Move translation and rendering logic to a client component
"use client";
import { useTranslations } from "next-intl";
import React from "react";
import { Badge } from "@heroui/badge";

import { StoryTabs } from "@/components/story/StoryTabs";
import { LastReadChapter } from "@/components/chapter/LastReadChapter";
import { Story } from "@/types/interfaces/story";
import { ApiInstant } from "@/utils/api";
import { useMarkAsReadTo } from "@/hooks/useMarkAsReadTo";
import { observer } from "mobx-react-lite";

export const StoryDetailClient = observer(({ story }: { story: Story }) => {
  const t = useTranslations("story");

  useMarkAsReadTo(async () => {
    try {
      await ApiInstant.post(`/stories/${story.slug}/mark-as-read`)
    } catch (error) {}
  });

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
})

export default StoryDetailClient
