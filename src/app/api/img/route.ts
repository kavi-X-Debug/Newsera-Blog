import sharp from 'sharp';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Hosts the article images come from. Anything else is sent straight to the original image.
const ALLOWED_HOST_SUFFIXES = [
  'techcrunch.com',
  'theverge.com',
  'vox-cdn.com',
  'wired.com',
  'bleepstatic.com',
  'googleusercontent.com',
  'thehackernews.com',
  'darkreading.com',
  'contentstack.com',
];

// Local testing only: a comma-separated list of extra hosts that may also be served over http.
const EXTRA_HOSTS = (process.env.IMAGE_PROXY_EXTRA_HOSTS || '').split(',').map((h) => h.trim()).filter(Boolean);

const WIDTH_BUCKETS = [96, 128, 256, 384, 640, 828, 1080, 1200];
const MAX_SOURCE_BYTES = 15 * 1024 * 1024;
const RESIZABLE = /^image\/(jpeg|png|webp|avif)/i;

const isAllowedHost = (host: string) =>
  EXTRA_HOSTS.includes(host) || ALLOWED_HOST_SUFFIXES.some((s) => host === s || host.endsWith(`.${s}`));

const fallback = (original: string) =>
  NextResponse.redirect(original, { status: 302, headers: { 'Cache-Control': 'public, s-maxage=600' } });

// Resizes and converts article images to WebP so pages load a few dozen KB instead of megabytes.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('u') || '';
  const width = Number.parseInt(searchParams.get('w') || '', 10);
  const quality = Math.min(Math.max(Number.parseInt(searchParams.get('q') || '70', 10) || 70, 40), 85);

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return new NextResponse('Bad request', { status: 400 });
  }
  if (!Number.isFinite(width) || width < 16 || width > 4096) return new NextResponse('Bad request', { status: 400 });
  const httpOk = target.protocol === 'http:' && EXTRA_HOSTS.includes(target.hostname);
  if (target.protocol !== 'https:' && !httpOk) return new NextResponse('Bad request', { status: 400 });
  if (!isAllowedHost(target.hostname)) return fallback(target.toString());

  const bucket = WIDTH_BUCKETS.find((w) => w >= width) ?? WIDTH_BUCKETS[WIDTH_BUCKETS.length - 1];

  try {
    const res = await fetch(target, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsEraImages/1.0; +https://newsera.blog)', Accept: 'image/*' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok || !isAllowedHost(new URL(res.url).hostname)) return fallback(target.toString());
    if (!RESIZABLE.test(res.headers.get('content-type') || '')) return fallback(target.toString());
    if (Number(res.headers.get('content-length') || 0) > MAX_SOURCE_BYTES) return fallback(target.toString());

    const input = Buffer.from(await res.arrayBuffer());
    if (input.length > MAX_SOURCE_BYTES) return fallback(target.toString());

    const output = await sharp(input, { failOn: 'none' })
      .rotate()
      .resize({ width: bucket, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();

    return new NextResponse(new Uint8Array(output), {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
      },
    });
  } catch {
    return fallback(target.toString());
  }
}
