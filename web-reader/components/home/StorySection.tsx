import { Button } from "@heroui/button";
import Link from "next/link";
import { StoriesWithSkeletonLoading } from "../common/utils/StoriesWithSkeletonLoading";
import { useTranslations } from "next-intl";

export const StorySection = ({ stories, title, className, titleIcon }: any) => {
  const t = useTranslations("home");
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex flex-row items-center">
          {titleIcon || "📚"} {title}
        </h2>
        <Link href="/search?sort=views">
          <Button size="sm" variant="light">
            {t("see_more")}
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <StoriesWithSkeletonLoading stories={stories} />
      </div>
    </div>
  );
};
