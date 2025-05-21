import { ApiInstant } from '@/utils/api';
import { Metadata } from 'next';

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const res = await ApiInstant.get(`/blogs/${params.slug}`);
  const blog = res.data;

  return {
    title: `${blog.title} | Vô Ưu Các`,
    description: blog.content?.replace(/<[^>]+>/g, '').slice(0, 160),
    openGraph: {
      title: blog.title,
      description: blog.content?.replace(/<[^>]+>/g, '').slice(0, 160),
      images: blog.cover ? [{ url: blog.cover }] : undefined,
    },
  };
}
