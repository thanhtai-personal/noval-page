"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Pagination } from "@heroui/pagination";
import { Checkbox } from "@heroui/checkbox";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";

import { StoriesWithSkeletonLoading } from "../common/utils/StoriesWithSkeletonLoading";
import { AuthorSelectModal } from "./AuthorSelectModal";
import { Story } from "@/types/interfaces/story";
import { ApiInstant } from "@/utils/api";
import { observer } from "mobx-react-lite";
import { useAppStore } from "@/store/Provider";

const ranges = [
  { label: "0 - 300", value: "0-300" },
  { label: "300 - 500", value: "300-500" },
  { label: "500 - 1000", value: "500-1000" },
  { label: "> 1000", value: "1000+" },
];

// Fetch API helpers
const fetchCategories = async () => {
  const res = await ApiInstant.get("/categories");
  return res.data || [];
};
const fetchTags = async () => {
  const res = await ApiInstant.get("/tags");
  return res.data?.data || [];
};
const fetchAuthors = async () => {
  const res = await ApiInstant.get("/authors");
  return res.data?.data || [];
};
const fetchStories = async ({
  keyword,
  sort,
  page,
  limit,
  categories,
  authors,
  tags,
}: any) => {
  const res = await ApiInstant.get(`/stories`, {
    params: {
      keyword,
      sort,
      page,
      limit,
      categories: categories.map((c: any) => c.slug).join(","),
      authors: authors.map((a: any) => a._id).join(","),
      tags: tags.map((t: any) => t._id).join(","),
    },
  });
  return res.data;
};

const SearchPageClient = observer(() => {
  const t = useTranslations("search");
  const params = useSearchParams();
  const [page, setPage] = useState(1);
  const limit = 20;
  const [authorModalOpen, setAuthorModalOpen] = useState(false);
  const [selectedAuthors, setSelectedAuthors] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<any[]>([]);
  const [selectedRanges, setSelectedRanges] = useState<string[]>([]);
  const store = useAppStore();
  const { theme } = useTheme();

  // Categories
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10,
  });
  // Tags
  const { data: tags = [], isLoading: loadingTags } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
    staleTime: 1000 * 60 * 10,
  });
  // Authors
  const { data: authors = [], isLoading: loadingAuthors } = useQuery({
    queryKey: ["authors"],
    queryFn: fetchAuthors,
    staleTime: 1000 * 60 * 10,
  });

  // Stories
  const keyword = params.get("keyword") || "";
  const sort = params.get("sort") || "";
  const storiesQueryKey = useMemo(
    () => [
      "stories",
      keyword,
      sort,
      page,
      selectedCategories.map((c) => c.slug).join(","),
      selectedAuthors.map((a) => a._id).join(","),
      selectedTags.map((t) => t._id).join(","),
      selectedRanges.join(","),
    ],
    [
      keyword,
      sort,
      page,
      selectedCategories,
      selectedAuthors,
      selectedTags,
      selectedRanges,
    ]
  );

  const {
    data: storiesData,
    isLoading: loadingStories,
  } = useQuery<any>({
    queryKey: storiesQueryKey,
    queryFn: () =>
      fetchStories({
        keyword,
        sort,
        page,
        limit,
        categories: selectedCategories,
        authors: selectedAuthors,
        tags: selectedTags,
        ranges: selectedRanges,
      }),
    staleTime: 1000 * 60 * 3,
  });

  const stories: Story[] = storiesData?.data || [];
  const total: number = storiesData?.total || 0;

  useEffect(() => {
    store.setAnimations({
      useIsland: false,
      useDNA: false,
      use3DIsland: false,
      useFantasyIsland: false,
      useUniverseBg: theme === "dark",
    });

    return () => {
      store.resetAnimations();
    };
  }, [theme]);

  // Checkbox logic
  const handleCategoryCheck = (cat: any) => {
    setSelectedCategories((prev) =>
      prev.some((c) => c._id === cat._id)
        ? prev.filter((c) => c._id !== cat._id)
        : [...prev, cat]
    );
  };
  const handleTagCheck = (tag: any) => {
    setSelectedTags((prev) =>
      prev.some((t) => t._id === tag._id)
        ? prev.filter((t) => t._id !== tag._id)
        : [...prev, tag]
    );
  };
  const handleRangeCheck = (value: string) => {
    setSelectedRanges((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  // Nút search (có thể xóa nếu muốn auto fetch theo filter)
  const handleSearch = (e?: any) => {
    if (e?.preventDefault) e.preventDefault();
    setPage(1);
    // useQuery sẽ tự động fetch lại do key thay đổi
  };

  return (
    <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      <aside className="space-y-6">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold mb-2">{t("category")}</h3>
          {loadingCategories ? (
            <div>{t("loading")}...</div>
          ) : (
            categories.map((cat: any) => (
              <Checkbox
                key={cat._id}
                value={cat.slug}
                checked={!!selectedCategories.find((c) => c._id === cat._id)}
                onChange={() => handleCategoryCheck(cat)}
              >
                {cat.name}
              </Checkbox>
            ))
          )}
        </div>
        <div>
          <h3 className="font-semibold mb-2 flex items-center justify-between">
            {t("author")}
            <Button
              size="lg"
              variant="light"
              onClick={() => setAuthorModalOpen(true)}
              onTouchEnd={() => setAuthorModalOpen(true)}
            >
              {t("choose_author")}
            </Button>
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedAuthors.map((author) => (
              <span
                key={author._id}
                className="px-2 py-1 bg-primary-100 rounded text-xs"
              >
                {author.name}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">{t("tag")}</h3>
          {loadingTags ? (
            <div>{t("loading")}...</div>
          ) : (
            tags.map((tag: any) => (
              <Checkbox
                key={tag._id}
                value={tag._id}
                checked={!!selectedTags.find((t) => t._id === tag._id)}
                onChange={() => handleTagCheck(tag)}
              >
                {tag.name}
              </Checkbox>
            ))
          )}
        </div>
        <div>
          <h3 className="font-semibold mb-2">{t("chapter_count")}</h3>
          {ranges.map((r) => (
            <Checkbox
              key={r.value}
              value={r.value}
              checked={selectedRanges.includes(r.value)}
              onChange={() => handleRangeCheck(r.value)}
            >
              {r.label}
            </Checkbox>
          ))}
        </div>
        <Button className="mt-4 w-full" size="sm" onClick={handleSearch}>
          {t("search")}
        </Button>
        <AuthorSelectModal
          open={authorModalOpen}
          selectedAuthors={selectedAuthors}
          setSelectedAuthors={setSelectedAuthors}
          onClose={() => setAuthorModalOpen(false)}
        />
      </aside>

      <section className="md:col-span-3 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingStories ? (
            <StoriesWithSkeletonLoading stories={[]} />
          ) : stories.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
              <span className="text-lg font-medium">{t("no_result")}</span>
            </div>
          ) : (
            <StoriesWithSkeletonLoading stories={stories} />
          )}
        </div>
        {total > limit && (
          <div className="flex justify-center">
            <Pagination
              page={page}
              total={Math.ceil(total / limit)}
              onChange={setPage}
            />
          </div>
        )}
      </section>
    </div>
  );
});

export default SearchPageClient;
