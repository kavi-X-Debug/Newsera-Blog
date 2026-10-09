'use client';

import { useCallback, useState } from 'react';

interface Row {
  id: string;
  slug: string;
  name: string;
  body: string;
  createdAt: number;
}

export default function CommentsAdmin() {
  const [token, setToken] = useState('');
  const [signedIn, setSignedIn] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(
    async (t: string, s: string) => {
      setError('');
      const res = await fetch(`/api/comments/admin${s ? `?slug=${encodeURIComponent(s)}` : ''}`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.status === 401) {
        setSignedIn(false);
        setError('Wrong token.');
        return;
      }
      const d = await res.json();
      if (!d.ok) {
        setError('Could not load comments.');
        return;
      }
      setSignedIn(true);
      setRows(d.comments);
    },
    [],
  );

  async function act(id: string, action: 'approve' | 'delete') {
    await fetch('/api/comments/admin', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    });
    load(token, slug);
  }

  if (!signedIn) {
    return (
      <div className="mx-auto max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Moderate comments</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load(token, '');
          }}
          className="space-y-3"
        >
          <label htmlFor="tok" className="block text-sm font-medium">Admin token</label>
          <input
            id="tok"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            autoComplete="off"
            className="h-10 w-full rounded-md border bg-background px-3"
          />
          <button className="h-10 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground">Sign in</button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">{slug ? 'Approved comments' : 'Pending comments'}</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          load(token, slug.trim());
        }}
        className="flex gap-2"
      >
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Article slug (leave empty for pending)"
          className="h-10 flex-1 rounded-md border bg-background px-3 text-sm"
        />
        <button className="h-10 rounded-md border px-4 text-sm">Show</button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {rows.length === 0 && <p className="text-sm text-muted-foreground">Nothing here.</p>}
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.id} className="rounded-lg border p-4 space-y-2">
            <div className="text-xs text-muted-foreground">
              {r.name} · {new Date(r.createdAt).toLocaleString()} ·{' '}
              <a className="underline" href={`/tech/${r.slug}`} target="_blank" rel="noreferrer">{r.slug}</a>
            </div>
            <p className="whitespace-pre-wrap break-words text-sm">{r.body}</p>
            <div className="flex gap-2">
              {!slug && (
                <button onClick={() => act(r.id, 'approve')} className="h-8 rounded-md bg-primary px-3 text-sm text-primary-foreground">Approve</button>
              )}
              <button onClick={() => act(r.id, 'delete')} className="h-8 rounded-md border px-3 text-sm">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
