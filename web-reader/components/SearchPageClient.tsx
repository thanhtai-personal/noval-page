'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ApiInstant } from "@/utils/api";
import { Story } from "@/types/interfaces/story";
import { Pagination } from "@heroui/pagination";
import { Checkbox } from "@heroui/checkbox";
import { Button } from "@heroui/button";
import { StoriesWithSkeletonLoading } from "./StoriesWithSkeletonLoading";

const ranges = [
  { label: "0 - 300", value: "0-300" },
  { label: "300 - 500", value: "300-500" },
  { label: "500 - 1000", value: "500-1000" },
  { label: "> 1000", value: "1000+" },
];

export default function SearchPageClient() {
  const params = useSearchParams();
  const [stories, setStories] = useState<Story[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    const fetchData = async () => {
      const [catRes, tagRes, authorRes] = await Promise.all([
        ApiInstant.get("/categories"),
        ApiInstant.get("/tags"),
        ApiInstant.get("/authors"),
      ]);
      setCategories(catRes.data?.data || []);
      setTags(tagRes.data?.data || []);
      setAuthors(authorRes.data?.data || []);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchStories = async () => {
      const keyword = params.get("keyword") || "";
      const sort = params.get("sort") || "";
      const res = await ApiInstant.get(`/stories`, {
        params: { keyword, sort, page, limit },
      });
      setStories(res.data.data);
      setTotal(res.data.total);
    };
    fetchStories();
  }, [params, page]);

  return (
    <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      <aside className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Danh mục</h3>
          {categories.map((cat) => (
            <Checkbox key={cat._id} value={cat.slug}>{cat.name}</Checkbox>
          ))}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Tác giả</h3>
          {authors.map((author) => (
            <Checkbox key={author._id} value={author._id}>{author.name}</Checkbox>
          ))}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Thẻ</h3>
          {tags.map((tag) => (
            <Checkbox key={tag._id} value={tag._id}>{tag.name}</Checkbox>
          ))}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Số chương</h3>
          {ranges.map((r) => (
            <Checkbox key={r.value} value={r.value}>{r.label}</Checkbox>
          ))}
        </div>
        <Button size="sm" className="mt-4 w-full">Áp dụng</Button>
      </aside>

      <section className="md:col-span-3 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <StoriesWithSkeletonLoading stories={stories} />
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
