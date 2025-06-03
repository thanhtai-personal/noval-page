export async function GET() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [storyRes, blogRes] = await Promise.all([
    fetch(`${API}/stories?limit=1000`)
      .then((res) => res.json())
      .catch(() => ({ data: [] })),
    fetch(`${API}/blogs?limit=1000`)
      .then((res) => res.json())
      .catch(() => ({ data: [] })),
  ]);

  const stories = storyRes?.data || [];
  const blogs = blogRes?.data || [];

  const urls = [
    { loc: "/", changefreq: "daily", priority: 1.0 },
    { loc: "/search", changefreq: "weekly", priority: 0.8 },
    { loc: "/blog", changefreq: "weekly", priority: 0.7 },
    ...stories.map((s: any) => ({
      loc: `/truyen/${s.slug}`,
      changefreq: "weekly",
      priority: 0.9,
    })),
    ...stories.flatMap((s: any) =>
      Array.from({ length: s.totalChapters || 0 }).map((_, i) => ({
        loc: `/truyen/${s.slug}/chuong/${i + 1}`,
        changefreq: "monthly",
        priority: 0.5,
      })),
    ),
    ...blogs.map((b: any) => ({
      loc: `/blog/${b.slug}`,
      changefreq: "monthly",
      priority: 0.6,
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `<url><loc>${process.env.NEXT_PUBLIC_SITE_URL}${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
