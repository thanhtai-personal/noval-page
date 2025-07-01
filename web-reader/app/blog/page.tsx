"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Pagination } from "@heroui/pagination";
import Link from "next/link";
import { ApiInstant } from "@/utils/api";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  cover?: string;
  views: number;
  createdAt: string;
}

const limit = 10;

const fetchBlogs = async (page: number, limit: number) => {
  const res = await ApiInstant.get("/blogs", {
    params: { page, limit, sort: "views" },
  });
  return res.data as { data: Blog[]; total: number };
};

export default function BlogPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs", page, limit],
    queryFn: () => fetchBlogs(page, limit),
  });

  const blogs = data?.data || [];
  const total = data?.total || 0;

  return (
    <section className="container mx-auto px-4 py-6 space-y-8">
      <h1 className="text-3xl font-bold">📝 Blog</h1>

      {isLoading ? (
        <div className="text-center py-8 text-lg text-gray-400">
          Đang tải...
        </div>
      ) : error ? (
        <div className="text-center text-red-500">
          Có lỗi xảy ra khi tải blog!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Card key={blog._id}>
              {blog.cover && (
                <CardHeader className="p-0">
                  <img
                    alt={blog.title}
                    className="w-full h-40 object-cover rounded-t"
                    src={blog.cover}
                  />
                </CardHeader>
              )}
              <CardBody>
                <h2 className="text-lg font-semibold">{blog.title}</h2>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {blog.content}
                </p>
              </CardBody>
              <CardFooter>
                <Link href={`/blog/${blog.slug}`}>
                  <Button color="primary" size="sm" variant="flat">
                    Xem chi tiết
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

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
  );
}
