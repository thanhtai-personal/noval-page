import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET() {
  const stories = await fetch(`${API_URL}/stories?limit=1000`).then(res => res.json());
  const blogs = await fetch(`${API_URL}/blogs?limit=1000`).then(res => res.json());

  const urls = [
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/search', changefreq: 'weekly', priority: 0.8 },
    { loc: '/blog', changefreq: 'weekly', priority: 0.7 },
    ...stories.data.map((s: any) => ({
      loc: `/truyen/${s.slug}`,
      changefreq: 'weekly',
      priority: 0.9,
    })),
    ...stories.data.flatMap((s: any) =>
      Array.from({ length: s.totalChapters }).map((_, i) => ({
        loc: `/truyen/${s.slug}/chuong/${i + 1}`,
        changefreq: 'monthly',
        priority: 0.5,
      }))
    ),
    ...blogs.data.map((b: any) => ({
      loc: `/blog/${b.slug}`,
      changefreq: 'monthly',
      priority: 0.6,
    })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (u) => `<url><loc>${process.env.NEXT_PUBLIC_SITE_URL}${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
    )
    .join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
