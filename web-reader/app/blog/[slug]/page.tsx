"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { ApiInstant } from "@/utils/api";

export default function BlogDetailPage() {
  const t = useTranslations("blog");
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await ApiInstant.get(`/blogs/${slug}`);

      setBlog(res.data);
    };

    fetchBlog();
  }, [slug]);

  if (!blog) return <p className="p-4">{t("loading")}</p>;

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
