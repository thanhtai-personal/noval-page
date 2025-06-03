"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Badge } from "@heroui/badge";
import { Button } from "@heroui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Story } from "@/types/interfaces/story";

export const StoryCard = ({
  story,
  isSlide,
}: {
  story: Story;
  isSlide?: boolean;
}) => {
  const t = useTranslations("story");

  return (
    <Card key={story._id}>
      <CardHeader className="p-0">
        <img
          alt={story.title}
          className={
            isSlide
              ? `w-auto h-[calc(100vh/2.8)] object-cover rounded-t mx-auto`
              : `w-full h-48 object-cover rounded-t`
          }
          src={story.cover}
        />
      </CardHeader>
      <CardBody>
        <h2 className="text-lg font-semibold">{story.title}</h2>
        <p className="text-sm text-gray-600 mb-1">
          {t("author")}: {story.author?.name}
        </p>
        <div
          dangerouslySetInnerHTML={{ __html: story.intro }}
          className="text-sm text-gray-600  whitespace-pre-wrap"
        />
        <div className="flex flex-wrap gap-1 mt-2">
          {story.categories.map((cat) => (
            <Badge key={cat.slug} color="primary" variant="flat">
              {cat.name}
            </Badge>
          ))}
          {story.tags.map((tag) => (
            <Badge key={tag.name} color="secondary" variant="flat">
              {tag.name}
            </Badge>
          ))}
        </div>
        <div className="mt-2 text-xs text-gray-500 space-y-1">
          <p>
            👁️ {t("views")}: {story.views}
          </p>
          <p>
            📖 {t("totalChapters")}: {story.totalChapters}
          </p>
          <p>
            🌟 {t("votes")}: {story.votes} | ❤️ {t("likes")}: {story.likes} | 📌{" "}
            {t("recommends")}: {story.recommends}
          </p>
        </div>
      </CardBody>
      <CardFooter>
        <Link href={`/truyen/${story.slug}`}>
          <Button color="primary" size="sm" variant="flat">
            {t("readNow")}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
