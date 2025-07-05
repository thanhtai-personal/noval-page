"use client";

import { Tabs, Tab } from "@heroui/tabs";
import { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import Link from "next/link";
import { Pagination } from "@heroui/pagination";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";

import { ApiInstant } from "@/utils/api";

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
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const limit = 20;
  const t = useTranslations('chapter');

  // Fetch chapters via TanStack Query
  const {
    data: chaptersData,
    isLoading,
    isError,
  } = useQuery<any>({
    queryKey: ["story-chapters", storySlug, page, limit, sort],
    queryFn: async () => {
      const sortParam = sort === 'asc' ? 'chapterNumber' : '-chapterNumber';
      const res = await ApiInstant.get(
        `/stories/${storySlug}/chapters?page=${page}&limit=${limit}&sort=${sortParam}`,
      );

      return res.data;
    },
    enabled: !!storySlug,
    staleTime: 1000 * 60 * 3,
  });

  const chapters = chaptersData?.data || [];
  const totalPages = chaptersData?.total
    ? Math.ceil(chaptersData.total / limit)
    : 1;

  return (
    <Card className="mt-6">
      <Tabs
        fullWidth
        aria-label="Tabs chi tiết truyện"
        color="primary"
        variant="underlined"
      >
        <Tab key="description" title="Mô tả">
          <CardBody>
            <h2 className="text-xl font-semibold mb-2">Mô tả</h2>
            <div
              dangerouslySetInnerHTML={{ __html: description }}
              className="text-default-700  whitespace-pre-wrap"
            />
          </CardBody>
        </Tab>
        <Tab key="chapters" title="Danh sách chương">
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Danh sách chương</h2>
              <Button
                onClick={() => {
                  setSort((s) => (s === 'asc' ? 'desc' : 'asc'));
                  setPage(1);
                }}
                size="sm"
                variant="light"
              >
                {sort === 'asc' ? t('sort_desc') : t('sort_asc')}
              </Button>
            </div>
            {isLoading ? (
              <div className="py-8 text-center text-default-400">
                Đang tải chương...
              </div>
            ) : isError ? (
              <div className="py-8 text-center text-red-400">
                Không thể tải chương.
              </div>
            ) : (
              <>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {chapters.map((chapter: any) => (
                    <li key={chapter._id}>
                      <Link
                        className="text-blue-600 hover:underline"
                        href={`/truyen/${storySlug}/chuong/${chapter.slug}`}
                      >
                        <span>Chương&nbsp;{chapter.chapterNumber}:&nbsp;</span>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: chapter.title
                              ?.replace(/<\/?span[^>]*>/g, "")
                              ?.replace(/chương\s*\d+\s*[:\-–]?\s*/i, ""),
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
                      onChange={setPage}
                    />
                  </div>
                </div>
              </>
            )}
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
