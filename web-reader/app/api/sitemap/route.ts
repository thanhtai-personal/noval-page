export async function GET() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [storyRes] = await Promise.all([
    fetch(`${API}/stories?limit=1000&sort=-views`)
      .then((res) => res.json())
      .catch(() => ({ data: [] })),
  ]);

  const stories = storyRes?.data || [];

  const urls = [
    { loc: "/", changefreq: "daily", priority: 1.0 },
    { loc: "/search", changefreq: "weekly", priority: 0.8 },
    { loc: "/blog", changefreq: "weekly", priority: 0.7 },
    ...stories.map((s: any) => ({
      loc: `/truyen/${s.slug}`,
      changefreq: "weekly",
      priority: 0.9,
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
