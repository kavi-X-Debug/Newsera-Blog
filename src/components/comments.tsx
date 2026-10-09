'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { MessageSquare } from 'lucide-react';

const REPO = process.env.NEXT_PUBLIC_GISCUS_REPO;
const REPO_ID = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
const CATEGORY = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
const CATEGORY_ID = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

/**
 * Comments powered by Giscus (GitHub Discussions). Moderation happens in the
 * repo's Discussions tab; commenters sign in with GitHub, which keeps spam out.
 * The third-party widget only loads after the reader asks for it, so it costs
 * nothing in page speed and no data is shared until they opt in.
 * Renders nothing until the NEXT_PUBLIC_GISCUS_* variables are set.
 */
export default function Comments({ term }: { term: string }) {
  const { resolvedTheme } = useTheme();
  const [loaded, setLoaded] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const theme = resolvedTheme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    if (!loaded || !host.current || !REPO || !REPO_ID || !CATEGORY_ID) return;
    const s = document.createElement('script');
    s.src = 'https://giscus.app/client.js';
    s.async = true;
    s.crossOrigin = 'anonymous';
    const attrs: Record<string, string> = {
      'data-repo': REPO,
      'data-repo-id': REPO_ID,
      'data-category': CATEGORY ?? 'Comments',
      'data-category-id': CATEGORY_ID,
      'data-mapping': 'specific',
      'data-term': term,
      'data-strict': '1',
      'data-reactions-enabled': '0',
      'data-emit-metadata': '0',
      'data-input-position': 'top',
      'data-theme': theme,
      'data-lang': 'en',
      'data-loading': 'lazy',
    };
    for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v);
    host.current.appendChild(s);
    const node = host.current;
    return () => {
      node.replaceChildren();
    };
    // theme changes are pushed to the iframe below instead of reloading it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, term]);

  useEffect(() => {
    if (!loaded) return;
    const frame = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    frame?.contentWindow?.postMessage({ giscus: { setConfig: { theme } } }, 'https://giscus.app');
  }, [theme, loaded]);

  if (!REPO || !REPO_ID || !CATEGORY_ID) return null;

  return (
    <section aria-labelledby="comments-heading" className="border-t pt-8 space-y-4">
      <h2 id="comments-heading" className="text-xl font-bold">Discussion</h2>
      {loaded ? (
        <div ref={host} />
      ) : (
        <div className="rounded-lg border bg-muted/40 p-5 space-y-3">
          <p className="text-sm text-muted-foreground">
            Comments are hosted on GitHub Discussions and moderated by our team. You sign in with a GitHub account to post.
            Loading them connects your browser to giscus.app and GitHub.
          </p>
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <MessageSquare size={16} /> Load comments
          </button>
        </div>
      )}
    </section>
  );
}
