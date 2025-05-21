import { ApiInstant } from '@/utils/api';
import { notFound } from 'next/navigation';

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  try {
    const res = await ApiInstant.get(`/blogs/${params.slug}`);
    const blog = res.data;

    return (
      <section className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold">{blog.title}</h1>
        <p className="text-sm text-gray-500">Lượt xem: {blog.views}</p>
        {blog.cover && (
          <img src={blog.cover} alt={blog.title} className="rounded w-full h-auto" />
        )}
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
      </section>
    );
  } catch {
    return notFound();
  }
}
