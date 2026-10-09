import { NextResponse } from 'next/server';
import { approve, getApproved, getPending, isAdmin, remove } from '@/lib/comments';

export const dynamic = 'force-dynamic';

const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });

export async function GET(request: Request) {
  if (!isAdmin(request)) return json({ ok: false }, 401);
  try {
    const slug = new URL(request.url).searchParams.get('slug');
    return json({ ok: true, comments: slug ? await getApproved(slug) : await getPending() });
  } catch {
    return json({ ok: false }, 502);
  }
}

export async function POST(request: Request) {
  if (!isAdmin(request)) return json({ ok: false }, 401);
  let b: { id?: unknown; action?: unknown };
  try {
    b = await request.json();
  } catch {
    return json({ ok: false }, 400);
  }
  if (typeof b.id !== 'string' || !/^[0-9a-f-]{36}$/.test(b.id)) return json({ ok: false }, 400);
  try {
    const done = b.action === 'approve' ? await approve(b.id) : b.action === 'delete' ? await remove(b.id) : false;
    return json({ ok: done });
  } catch {
    return json({ ok: false }, 502);
  }
}
