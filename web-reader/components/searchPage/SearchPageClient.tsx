"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Pagination } from "@heroui/pagination";
import { Checkbox } from "@heroui/checkbox";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";

import { StoriesWithSkeletonLoading } from "../common/utils/StoriesWithSkeletonLoading";

import { AuthorSelectModal } from "./AuthorSelectModal";

import { Story } from "@/types/interfaces/story";
import { ApiInstant } from "@/utils/api";

const ranges = [
  { label: "0 - 300", value: "0-300" },
  { label: "300 - 500", value: "300-500" },
  { label: "500 - 1000", value: "500-1000" },
  { label: "> 1000", value: "1000+" },
];

export default function SearchPageClient() {
  const t = useTranslations("search");
  const params = useSearchParams();
  const [stories, setStories] = useState<Story[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [authorModalOpen, setAuthorModalOpen] = useState(false);
  const [selectedAuthors, setSelectedAuthors] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [catRes, tagRes, authorRes] = await Promise.all([
        ApiInstant.get("/categories"),
        ApiInstant.get("/tags"),
        ApiInstant.get("/authors"),
      ]);

      setCategories(catRes.data || []);
      setTags(tagRes.data?.data || []);
      setAuthors(authorRes.data?.data || []);
    };

    fetchData();
  }, []);

  const handleSearch = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const keyword = params.get("keyword") || "";
    const sort = params.get("sort") || "";
    const res = await ApiInstant.get(`/stories`, {
      params: {
        keyword,
        sort,
        page,
        limit,
        categories,
        authors,
        tags,
      },
    });

    setStories(res.data.data);
    setTotal(res.data.total);
  };

  useEffect(() => {
    handleSearch();
  }, [params, page]);

  return (
    <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      <aside className="space-y-6">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold mb-2">{t("category")}</h3>
          {categories.map((cat) => (
            <Checkbox key={cat._id} value={cat.slug}>
              {cat.name}
            </Checkbox>
          ))}
        </div>
        <div>
          <h3 className="font-semibold mb-2 flex items-center justify-between">
            {t("author")}
            <Button
              size="lg"
              variant="light"
              onClick={() => setAuthorModalOpen(true)}
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
          {tags.map((tag) => (
            <Checkbox key={tag._id} value={tag._id}>
              {tag.name}
            </Checkbox>
          ))}
        </div>
        <div>
          <h3 className="font-semibold mb-2">{t("chapter_count")}</h3>
          {ranges.map((r) => (
            <Checkbox key={r.value} value={r.value}>
              {r.label}
            </Checkbox>
          ))}
        </div>
        <Button
          className="mt-4 w-full"
          size="sm"
          onChange={(e: any) => handleSearch(e)}
        >
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stories.length === 0 ? (
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
}
