"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { observer } from "mobx-react-lite";

import { Story } from "@/types/interfaces/story";
import ThreeDCardHover from "@/components/animations/cards/3DCardHover";
import NeonButtons from "@/components/animations/buttons/NeonButtons";

export const StoryCard = observer(
  ({ story, isSlide }: { story: Story; isSlide?: boolean }) => {
    const t = useTranslations("story");

    const WrapperComponent = isSlide ? "div" : ThreeDCardHover;

    return (
      <div
        key={story._id}
        className="grid w-full h-full place-items-center rounded-md"
      >
        <WrapperComponent
          className="w-full h-full rounded-md overflow-hidden"
          id={story._id}
        >
          <Card
            className={`w-full h-full rounded-[22px] ${
              isSlide ? "bg-[#2585f399]" : ""
            } backdrop:blur-xl`}
            style={{
              background: isSlide
                ? `linear-gradient(135deg, #2585f399, ${story.cover ? "#fff0" : "#f7b80199"}, #f75c0299)`
                : ``,
            }}
          >
            <CardHeader className="p-0">
              {isSlide ? (
                <img
                  alt={story.title}
                  className={`w-auto mt-2 h-[calc(100vh/2.8)] object-cover rounded-t mx-auto rounded-md`}
                  fetchPriority="high"
                  loading="lazy"
                  src={story.cover}
                  style={{
                    boxShadow: "0px 0px 8px 6px rgba(247, 92, 2, 0.3)",
                  }}
                />
              ) : (
                <img
                  alt={story.title}
                  className={`w-full h-48 object-cover rounded-t`}
                  fetchPriority="high"
                  loading="lazy"
                  src={story.cover}
                />
              )}
            </CardHeader>
            <CardBody
              className={`w-full ${!isSlide ? "max-w-[280px]" : ""} overflow-hidden`}
            >
              <h2 className="text-lg font-semibold w-full text-ellipsis whitespace-nowrap overflow-hidden">
                {story.title}
              </h2>
              <p className="text-sm text-gray-600 mb-1 whitespace-nowrap text-ellipsis overflow-hidden">
                {t("author")}: {story.author?.name}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {story.categories.map((cat) => (
                  <div key={cat.slug} color="primary">
                    {cat.name}
                  </div>
                ))}
                {story.tags.map((tag) => (
                  <div key={tag.name} color="secondary">
                    {tag.name}
                  </div>
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
                  🌟 {t("votes")}: {story.votes} | ❤️ {t("likes")}:{" "}
                  {story.likes} | 📌 {t("recommends")}: {story.recommends}
                </p>
              </div>
            </CardBody>
            <CardFooter>
              <Link href={`/truyen/${story.slug}`}>
                <NeonButtons.Lightning>{t("readNow")}</NeonButtons.Lightning>
              </Link>
            </CardFooter>
          </Card>
        </WrapperComponent>
      </div>
    );
  },
);
