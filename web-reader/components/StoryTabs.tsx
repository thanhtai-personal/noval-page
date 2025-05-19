"use client";

import { Tabs, Tab } from "@heroui/tabs";
import { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import Link from "next/link";
import { ApiInstant } from "@/utils/api";

export function StoryTabs({
  storyId,
  slug,
  description,
}: {
  storyId: string;
  slug: string;
  description: string;
}) {
  const [chapters, setChapters] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchChapters = async () => {
    const res = await ApiInstant.get(
      `/chapters?story=${storyId}&page=${page}&limit=20`
    );
    setChapters(res.data.data || []);
    setTotalPages(Math.ceil(res.data.total / 20));
  };

  useEffect(() => {
    fetchChapters();
  }, [page]);

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
              className="text-default-700"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </CardBody>
        </Tab>
        <Tab key="chapters" title="Danh sách chương">
          <CardBody>
            <h2 className="text-xl font-semibold mb-4">Danh sách chương</h2>
            <ul className="space-y-2">
              {chapters.map((chapter: any) => (
                <li key={chapter._id}>
                  <Link href={`/truyen/${slug}/chuong/${chapter.index}`}>
                    <span className="text-blue-600 hover:underline">
                      {chapter.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex justify-center gap-4 mt-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 border rounded-3xl ${
                    page === i + 1 ? "bg-blue-500" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}
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
