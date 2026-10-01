import { getAllPosts } from '@/lib/posts';
import { categoryPath } from '@/lib/categories';
import { SITE_URL, SITE_NAME, SITE_TAGLINE } from '@/lib/seo';

export const revalidate = 3600;

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function GET() {
  const posts = getAllPosts().slice(0, 50);
  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/${categoryPath(p.category)}/${p.slug}`;
      return `<item><title>${esc(p.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(p.date).toUTCString()}</pubDate><category>${esc(p.category)}</category><description>${esc(p.description || '')}</description></item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${SITE_NAME}</title><link>${SITE_URL}</link><description>${esc(SITE_TAGLINE)}</description><language>en-us</language><atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
