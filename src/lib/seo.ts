import type { Metadata } from 'next';
import type { Post } from '@/lib/posts';

export const SITE_URL = 'https://newsera.blog';
export const SITE_NAME = 'News Era';
export const SITE_TAGLINE = 'Latest Tech, Cybersecurity & AI News Today';
export const TWITTER_HANDLE = '@newsera_blog';

export const SITE_KEYWORDS = [
  'tech news',
  'latest technology news',
  'cybersecurity news',
  'AI news',
  'data breach news',
  'ransomware',
  'zero-day vulnerabilities',
  'OpenAI',
  'ChatGPT',
  'Anthropic',
  'Google',
  'Apple',
  'Microsoft',
  'startup news',
  'business news',
  'newsera',
];

type ListingSeo = {
  title: string;
  heading: string;
  description: string;
  keywords: string[];
};

// Keyword sets come from the most frequent terms in the existing posts plus search intent.
export const LISTING_SEO: Record<string, ListingSeo> = {
  '/': {
    title: `${SITE_NAME} – ${SITE_TAGLINE}`,
    heading: 'Latest News',
    description:
      'News Era delivers the latest tech news, cybersecurity alerts, AI updates, business and science headlines every day, with clear summaries of what happened and why it matters.',
    keywords: SITE_KEYWORDS,
  },
  '/breaking': {
    title: 'Breaking News – Latest Tech & Security Stories (Last 12 Hours)',
    heading: 'Breaking News',
    description:
      'Breaking news from News Era: the newest tech, cybersecurity, AI and business stories published in the last 12 hours.',
    keywords: ['breaking news', 'latest news', 'news today', 'tech news today', 'cybersecurity news today', 'just in'],
  },
  '/tech': {
    title: 'Latest Tech News – AI, Apple, Google & Startups',
    heading: 'Tech News',
    description:
      'Breaking technology news: AI models, OpenAI, Google, Apple, Microsoft, startups, gadgets, apps and data centers, summarized with what it means for you.',
    keywords: [
      'tech news', 'latest technology news', 'AI news', 'OpenAI', 'ChatGPT', 'Anthropic', 'Google', 'Apple',
      'Microsoft', 'Amazon', 'Meta', 'startup news', 'gadgets', 'software updates', 'data centers', 'tech deals',
    ],
  },
  '/cybersecurity': {
    title: 'Cybersecurity News – Data Breaches, Ransomware & Zero-Days',
    heading: 'Cybersecurity News',
    description:
      'Daily cybersecurity news: data breaches, ransomware attacks, actively exploited zero-day flaws, CISA alerts, malware and patches, explained in plain language.',
    keywords: [
      'cybersecurity news', 'data breach', 'ransomware attacks', 'zero-day vulnerability', 'actively exploited',
      'CISA', 'malware', 'hackers', 'remote code execution', 'supply chain attack', 'security patches', 'critical vulnerability',
    ],
  },
  '/sports': {
    title: 'Sports & Gaming News – World Cup, Esports & Game Releases',
    heading: 'Sports News',
    description:
      'Sports and gaming headlines: World Cup and FIFA updates, esports, game releases and gaming hardware, with quick summaries.',
    keywords: ['sports news', 'World Cup', 'FIFA', 'gaming news', 'esports', 'game releases', 'Steam', 'gaming hardware'],
  },
  '/business': {
    title: 'Business & Economic News – Markets, IPOs & Acquisitions',
    heading: 'Business / Economic News',
    description:
      'Business and economic news: stock markets, IPOs, acquisitions, funding rounds, energy markets and the global economy, summarized for busy readers.',
    keywords: [
      'business news', 'economic news', 'stock market', 'IPO', 'acquisition', 'funding round', 'investment',
      'energy markets', 'global economy', 'startup funding',
    ],
  },
  '/politics': {
    title: 'Political News – Tech Policy, Regulation & Government',
    heading: 'Political News',
    description:
      'Political news with a tech focus: AI regulation, tech policy, lawmakers, antitrust cases, courts and government decisions that shape the digital world.',
    keywords: [
      'political news', 'tech policy', 'AI regulation', 'lawmakers', 'antitrust', 'Justice Department',
      'Trump administration', 'government technology', 'legislation',
    ],
  },
  '/science': {
    title: 'Science & Technology News – Space, NASA & Innovation',
    heading: 'Science & Technology News',
    description:
      'Science and technology news: space missions, NASA, SpaceX, research breakthroughs, energy and innovation, explained clearly.',
    keywords: ['science news', 'technology news', 'space news', 'NASA', 'SpaceX', 'Artemis', 'research breakthrough', 'innovation', 'solar energy'],
  },
};

const STOP = new Set(
  'the and for with from that this these those into over under after before about have has had will would could should more most new says said how why what who which when where just also your their they them than then are was were not but you our out its via per all any one two get gets use used using says'.split(' '),
);

export function postKeywords(post: Post): string[] {
  const cat = Object.values(LISTING_SEO).find((c) => c.heading === post.category) ??
    LISTING_SEO[
      ({
        Tech: '/tech',
        Cybersecurity: '/cybersecurity',
        'Sports News': '/sports',
        'Business / Economic News': '/business',
        'Political News': '/politics',
        'Science & Technology News': '/science',
      } as Record<string, string>)[post.category] ?? '/tech'
    ];

  const seen = new Set<string>();
  const scored: { term: string; score: number; pos: number }[] = [];
  post.title.split(/[\s:|–—,;()"“”‘’']+/).forEach((raw, pos) => {
    const t = raw.replace(/^[^\w]+|[^\w.+-]+$/g, '');
    const key = t.toLowerCase();
    if (t.length < 3 || STOP.has(key) || /^\d+$/.test(t) || seen.has(key)) return;
    seen.add(key);
    // Favor brand/product/acronym-looking tokens (REvil, OpenAI, CVE-2026-1, Q3) over plain words.
    let score = 0;
    if (/[A-Z].*[A-Z]/.test(t) || /\d/.test(t)) score += 3;
    if (t.length >= 7) score += 1;
    if (t.length >= 4) score += 1;
    if (score > 0) scored.push({ term: t, score, pos });
  });
  const terms = scored.sort((a, b) => b.score - a.score || a.pos - b.pos).slice(0, 5).map((x) => x.term);
  return [...terms, ...cat.keywords.slice(0, 3)];
}

export function listingMetadata(path: keyof typeof LISTING_SEO | string, rawPage?: string): Metadata {
  const seo = LISTING_SEO[path];
  const n = Number.parseInt(rawPage ?? '1', 10);
  const page = Number.isNaN(n) || n < 1 ? 1 : n;
  const canonical = page > 1 ? `${path === '/' ? '/' : path}?page=${page}` : path;
  const title = page > 1 ? `${seo.title} – Page ${page}` : seo.title;
  const base: Metadata = {
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical, types: { 'application/rss+xml': `${SITE_URL}/feed.xml` } },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description: seo.description,
      siteName: SITE_NAME,
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: { card: 'summary_large_image', title, description: seo.description, site: TWITTER_HANDLE, images: ['/opengraph-image'] },
  };
  return path === '/' ? { ...base, title: { absolute: title } } : { ...base, title };
}
