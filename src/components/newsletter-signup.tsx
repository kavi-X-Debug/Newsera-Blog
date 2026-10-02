'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';

type State =
  | { status: 'idle' | 'loading' }
  | { status: 'success' | 'error'; message: string };

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [state, setState] = useState<State>({ status: 'idle' });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state.status === 'loading') return;
    setState({ status: 'loading' });
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setState({ status: 'success', message: data.message });
        setEmail('');
      } else {
        setState({ status: 'error', message: data.message || 'Something went wrong. Please try again.' });
      }
    } catch {
      setState({ status: 'error', message: 'Network error. Please check your connection and try again.' });
    }
  }

  return (
    <section aria-labelledby="newsletter-heading" className="rounded-2xl border bg-muted/40 p-6 md:p-8">
      <div className="flex items-center gap-2 text-primary">
        <Mail size={18} aria-hidden="true" />
        <h3 id="newsletter-heading" className="text-lg font-bold text-foreground">
          Get the News Era newsletter
        </h3>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        The most important tech and cybersecurity stories, delivered to your inbox. Free, and you can unsubscribe at any time.
      </p>

      {state.status === 'success' ? (
        <p role="status" className="mt-4 flex items-start gap-2 rounded-md border border-green-600/30 bg-green-600/10 p-3 text-sm">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-600" aria-hidden="true" />
          <span>{state.message}</span>
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={state.status === 'loading'}
              aria-describedby="newsletter-consent newsletter-feedback"
              className="h-11 flex-1 rounded-md border bg-background px-4 text-base focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
            />
            {/* Honeypot: hidden from people and assistive tech, bots tend to fill it in. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Website
                <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </label>
            </div>
            <button
              type="submit"
              disabled={state.status === 'loading'}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {state.status === 'loading' ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Subscribing…
                </>
              ) : (
                'Subscribe'
              )}
            </button>
          </div>
          <p id="newsletter-feedback" role={state.status === 'error' ? 'alert' : undefined} className="min-h-5 text-sm text-red-700 dark:text-red-400">
            {state.status === 'error' ? state.message : ''}
          </p>
          <p id="newsletter-consent" className="text-xs text-muted-foreground">
            By subscribing you agree to receive our newsletter by email. We only use your address to send it, and never sell it. See our{' '}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      )}
    </section>
  );
}
