import { NextResponse } from 'next/server';
import { addPending, commentsEnabled, getApproved, hasLink, tooManyRequests, MAX_BODY, MAX_NAME, MIN_BODY } from '@/lib/comments';
import { getPostBySlug } from '@/lib/posts';

export const dynamic = 'force-dynamic';

const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });

export async function GET(request: Request) {
  if (!commentsEnabled) return json({ enabled: false, comments: [] });
  const slug = new URL(request.url).searchParams.get('slug') ?? '';
  if (!getPostBySlug(slug)) return json({ enabled: true, comments: [] });
  try {
    const comments = await getApproved(slug);
    return json({ enabled: true, comments: comments.map(({ id, name, body, createdAt }) => ({ id, name, body, createdAt })) });
  } catch (err) {
    console.error('comments GET failed', err);
    return json({ enabled: false, comments: [] });
  }
}

export async function POST(request: Request) {
  if (!commentsEnabled) return json({ ok: false, message: 'Comments are temporarily unavailable.' }, 503);

  let b: { slug?: unknown; name?: unknown; body?: unknown; website?: unknown };
  try {
    b = await request.json();
  } catch {
    return json({ ok: false, message: 'Invalid request.' }, 400);
  }

  const thanks = { ok: true, message: 'Thanks! Your comment was received and will appear once it has been reviewed.' };
  // Hidden honeypot field: real visitors never fill it in. Answer as if it worked.
  if (typeof b.website === 'string' && b.website.trim() !== '') return json(thanks);

  const slug = typeof b.slug === 'string' ? b.slug : '';
  const name = typeof b.name === 'string' ? b.name.trim().replace(/\s+/g, ' ') : '';
  const body = typeof b.body === 'string' ? b.body.trim() : '';

  if (!getPostBySlug(slug)) return json({ ok: false, message: 'Article not found.' }, 404);
  if (name.length < 1 || name.length > MAX_NAME) return json({ ok: false, message: `Please enter a name (up to ${MAX_NAME} characters).` }, 400);
  if (body.length < MIN_BODY || body.length > MAX_BODY) {
    return json({ ok: false, message: `Comments must be between ${MIN_BODY} and ${MAX_BODY} characters.` }, 400);
  }
  if (hasLink(body) || hasLink(name)) {
    return json({ ok: false, message: 'Links are not allowed in comments. Please remove them and try again.' }, 400);
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  try {
    if (await tooManyRequests(ip, 3, 10 * 60)) {
      return json({ ok: false, message: 'Too many comments. Please try again in a few minutes.' }, 429);
    }
    await addPending(slug, name, body);
    return json(thanks);
  } catch (err) {
    console.error('comments POST failed', err);
    return json({ ok: false, message: 'Something went wrong. Please try again later.' }, 502);
  }
}
