import sharp from 'sharp';
import { NextResponse } from 'next/server';
import { fetchSource } from '@/lib/image-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// One fixed sample image per news site. Open /api/img/check to see whether the resizer can reach each site.
const SAMPLES = [
  "https://media.wired.com/photos/6a6cc5c02bba9f4c44a51585/191:100/w_1280,c_limit/Reality-Aboflah_lead.jpg",
  "https://techcrunch.com/wp-content/uploads/2026/05/Disrupt-2025-Builders-Stage-Crowd.png?resize=1200,800",
  "https://www.bleepstatic.com/content/hl-images/2026/04/15/Windows_Server.jpg",
  "https://platform.theverge.com/wp-content/uploads/sites/2/2025/03/acastro_STK092_04.jpg?quality=90&strip=all&crop=0,0,100,100",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgbdAzWwJ7WC6PL7vtBZDUWfVyYu9iIBlT3X5gZn-Yl9aRuZAEeW3RjEU81RQWsvH_7og6v7-somVgG-fR35drKy6bxLMcHdpJQAi6ydXw-m3oMxZ1hlDC7kr8Wsu0dOfRt6ZLEasAsYNGq-pzmQiBNWMbEBzqa9zYdAu16NtgIfDe3PpOvCVzGj6yFqmet/s1600/wordpress-exploit.jpg"
];

export async function GET() {
  const results = await Promise.all(
    SAMPLES.map(async (url) => {
      const host = new URL(url).hostname;
      const source = await fetchSource(new URL(url));
      if (!source.ok) return { host, works: false, problem: source.reason, ms: source.ms };
      try {
        const out = await sharp(source.input, { failOn: 'none' }).resize({ width: 640, withoutEnlargement: true }).webp({ quality: 70 }).toBuffer();
        return { host, works: true, originalKB: Math.round(source.input.length / 1024), resizedKB: Math.round(out.length / 1024), ms: source.ms };
      } catch {
        return { host, works: false, problem: 'could not convert the image', ms: source.ms };
      }
    }),
  );
  return NextResponse.json({ checkedAt: new Date().toISOString(), results }, { headers: { 'Cache-Control': 'no-store' } });
}
