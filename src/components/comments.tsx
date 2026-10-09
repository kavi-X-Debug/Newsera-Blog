'use client';

import { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';

interface PublicComment {
  id: string;
  name: string;
  body: string;
  createdAt: number;
}

const MAX_BODY = 1500;

function ago(ts: number): string {
  const mins = Math.max(1, Math.round((Date.now() - ts) / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/** Reader comments: no account needed, every comment is reviewed before it appears. */
export default function Comments({ slug }: { slug: string }) {
  const [enabled, setEnabled] = useState(false);
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('commenter-name');
      if (saved) setName(saved);
    } catch {}
    let cancelled = false;
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setEnabled(Boolean(d.enabled));
        setComments(d.comments ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!enabled) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name, body, website }),
      });
      const data = await res.json();
      setMessage(data.message ?? '');
      if (data.ok) {
        setStatus('ok');
        setBody('');
        try {
          localStorage.setItem('commenter-name', name);
        } catch {}
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  return (
    <section aria-labelledby="comments-heading" className="border-t pt-8 space-y-6">
      <h2 id="comments-heading" className="text-xl font-bold flex items-center gap-2">
        <MessageSquare size={20} /> Comments{comments.length > 0 && ` (${comments.length})`}
      </h2>

      {comments.length > 0 ? (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="rounded-lg border p-4">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-semibold">{c.name}</span>
                <time className="text-muted-foreground" dateTime={new Date(c.createdAt).toISOString()}>{ago(c.createdAt)}</time>
              </div>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">{c.body}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No comments yet. Be the first to share your thoughts.</p>
      )}

      <form onSubmit={submit} className="space-y-3 rounded-lg border bg-muted/40 p-4">
        <h3 className="font-semibold">Leave a comment</h3>
        <div>
          <label htmlFor="c-name" className="block text-sm font-medium mb-1">Name</label>
          <input
            id="c-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            required
            autoComplete="nickname"
            className="h-10 w-full rounded-md border bg-background px-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="c-body" className="block text-sm font-medium mb-1">Comment</label>
          <textarea
            id="c-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={MAX_BODY}
            required
            rows={4}
            className="w-full rounded-md border bg-background px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="mt-1 text-xs text-muted-foreground">{body.length}/{MAX_BODY}</p>
        </div>
        {/* Honeypot: hidden from people, tempting for bots. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={status === 'sending'}
            className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending…' : 'Post comment'}
          </button>
          <p className="text-xs text-muted-foreground">No account needed. Comments are reviewed before they appear. Links are not allowed.</p>
        </div>
        <p role="status" aria-live="polite" className={`text-sm ${status === 'error' ? 'text-red-600 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>
          {status === 'ok' || status === 'error' ? message : ''}
        </p>
      </form>
    </section>
  );
}
