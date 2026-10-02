import { NextResponse } from 'next/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

// Best-effort per-instance limiter; the provider's own abuse protection is the real backstop.
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const ok = () =>
  NextResponse.json({
    ok: true,
    message: 'Almost done! Check your inbox and click the confirmation link to finish subscribing.',
  });

export async function POST(request: Request) {
  let body: { email?: unknown; website?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request.' }, { status: 400 });
  }

  // Hidden honeypot field: real visitors never fill it in. Answer as if it worked.
  if (typeof body.website === 'string' && body.website.trim() !== '') return ok();

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, message: 'Please enter a valid email address.' }, { status: 400 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, message: 'Too many attempts. Please try again in a few minutes.' }, { status: 429 });
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    console.error('BUTTONDOWN_API_KEY is not set');
    return NextResponse.json({ ok: false, message: 'Newsletter signup is temporarily unavailable.' }, { status: 503 });
  }

  try {
    const res = await fetch('https://api.buttondown.com/v1/subscribers', {
      method: 'POST',
      headers: { Authorization: `Token ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_address: email }),
      signal: AbortSignal.timeout(8000),
    });

    if (res.ok) return ok();

    const data = await res.json().catch(() => ({}));
    // Already subscribed: respond identically so the form cannot be used to probe who is on the list.
    if (res.status === 400 && JSON.stringify(data).includes('email_already_exists')) return ok();
    if (res.status === 400) {
      return NextResponse.json({ ok: false, message: 'That email address could not be added. Please check it and try again.' }, { status: 400 });
    }

    console.error('Buttondown error', res.status, JSON.stringify(data).slice(0, 300));
    return NextResponse.json({ ok: false, message: 'Something went wrong. Please try again later.' }, { status: 502 });
  } catch (err) {
    console.error('Buttondown request failed', err);
    return NextResponse.json({ ok: false, message: 'Something went wrong. Please try again later.' }, { status: 502 });
  }
}
