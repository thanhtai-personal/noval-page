"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { ApiInstant } from "@/utils/api";

export default function BlogDetailPage() {
  const t = useTranslations("blog");
  const { slug } = useParams() as { slug: string };

  // Hàm fetch blog detail
  const fetchBlog = async (slug: string) => {
    const res = await ApiInstant.get(`/blogs/${slug}`);

    return res.data;
  };

  // Dùng useQuery, key phụ thuộc slug
  const {
    data: blog,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blog", slug],
    queryFn: () => fetchBlog(slug),
    enabled: !!slug, // Chỉ fetch nếu có slug
  });

  if (isLoading) return <p className="p-4">{t("loading")}</p>;
  if (error) return <p className="p-4 text-red-500">{t("load_error")}</p>;
  if (!blog) return null;

  return (
    <section className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">{blog.title}</h1>
      <p className="text-sm text-gray-500">
        {t("views")}: {blog.views}
      </p>
      {blog.cover && (
        <img
          alt={blog.title}
          className="rounded w-full h-auto"
          fetchPriority="high"
          loading="lazy"
          src={blog.cover}
        />
      )}
      <div
        dangerouslySetInnerHTML={{ __html: blog.content }}
        className="prose max-w-none whitespace-pre-wrap"
      />
    </section>
  );
}
