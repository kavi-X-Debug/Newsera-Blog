import { getAllPosts } from '@/lib/posts';
import { categoryPath } from '@/lib/categories';
import { SITE_URL, SITE_NAME } from '@/lib/seo';

export const revalidate = 3600;

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Google News sitemaps only list articles published in the last 2 days.
export function GET() {
  const cutoff = Date.now() - 2 * 24 * 60 * 60 * 1000;
  const recent = getAllPosts()
    .filter((p) => new Date(p.date).getTime() >= cutoff)
    .slice(0, 1000);

  const urls = recent
    .map(
      (p) =>
        `<url><loc>${SITE_URL}/${categoryPath(p.category)}/${p.slug}</loc><news:news><news:publication><news:name>${SITE_NAME}</news:name><news:language>en</news:language></news:publication><news:publication_date>${new Date(p.date).toISOString()}</news:publication_date><news:title>${esc(p.title)}</news:title></news:news></url>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${urls}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
