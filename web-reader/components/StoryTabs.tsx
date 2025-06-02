"use client";

import { Tabs, Tab } from "@heroui/tabs";
import { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import Link from "next/link";
import { ApiInstant } from "@/utils/api";
import { Pagination } from "@heroui/pagination";

export function StoryTabs({
  storyId,
  slug,
  description,
  storySlug,
}: {
  storyId: string;
  storySlug: string;
  slug: string;
  description: string;
}) {
  const [chapters, setChapters] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchChapters = async () => {
    const res = await ApiInstant.get(
      `/stories/${storySlug}/chapters?page=${page}&limit=20`
    );
    setChapters(res.data.data || []);
    setTotalPages(Math.ceil(res.data.total / 20));
  };

  useEffect(() => {
    fetchChapters();
  }, [storySlug, page]);

  return (
    <Card className="mt-6">
      <Tabs
        aria-label="Tabs chi tiết truyện"
        variant="underlined"
        color="primary"
        fullWidth
      >
        <Tab key="description" title="Mô tả">
          <CardBody>
            <h2 className="text-xl font-semibold mb-2">Mô tả</h2>
            <div
              className="text-default-700  whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </CardBody>
        </Tab>
        <Tab key="chapters" title="Danh sách chương">
          <CardBody>
            <h2 className="text-xl font-semibold mb-4">Danh sách chương</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {chapters.map((chapter: any) => (
                <li key={chapter._id}>
                  <Link
                    className="text-blue-600 hover:underline"
                    href={`/truyen/${storySlug}/chuong/${chapter.slug}`}
                  >
                    <span>Chương&nbsp;{chapter.chapterNumber + 1}:&nbsp;</span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: chapter.title?.replace(/<\/?span[^>]*>/g, ""), // xóa tất cả thẻ span nếu có
                      }}
                    />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex justify-center gap-4 mt-10">
              <div className="flex flex-wrap gap-4 items-center">
                <Pagination
                  initialPage={page}
                  size="md"
                  total={totalPages}
                  onChange={(newPage) => setPage(newPage)}
                />
              </div>
            </div>
          </CardBody>
        </Tab>
        <Tab key="comments" title="Bình luận">
          <CardBody>
            <h2 className="text-xl font-semibold mb-2">Bình luận</h2>
            <p>Tính năng đang phát triển...</p>
          </CardBody>
        </Tab>
      </Tabs>
    </Card>
  );
}
