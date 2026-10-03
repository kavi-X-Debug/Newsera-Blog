import sharp from 'sharp';
import { NextResponse } from 'next/server';
import { EXTRA_HOSTS, fetchSource, isAllowedHost } from '@/lib/image-proxy';

export const runtime = 'nodejs';

const WIDTH_BUCKETS = [96, 128, 256, 384, 640, 828, 1080, 1200];

// When an image cannot be resized, the visitor is sent to the original; the reason is in X-Img-Fallback.
const fallback = (original: string, reason: string) =>
  NextResponse.redirect(original, {
    status: 302,
    headers: { 'Cache-Control': 'public, s-maxage=600', 'X-Img-Fallback': reason },
  });

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
  if (!isAllowedHost(target.hostname)) return fallback(target.toString(), 'host not allowed');

  const bucket = WIDTH_BUCKETS.find((w) => w >= width) ?? WIDTH_BUCKETS[WIDTH_BUCKETS.length - 1];

  const source = await fetchSource(target);
  if (!source.ok) return fallback(target.toString(), source.reason);

  try {
    const output = await sharp(source.input, { failOn: 'none' })
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
    return fallback(target.toString(), 'could not convert the image');
  }
}
