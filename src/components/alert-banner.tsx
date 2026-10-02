'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import type { SiteAlert, AlertLevel } from '@/lib/alert';

// Label text always accompanies the colour, so meaning never depends on colour alone.
const LEVELS: Record<AlertLevel, { label: string; chip: string }> = {
  breaking: { label: 'Breaking', chip: 'bg-red-700' },
  security: { label: 'Security alert', chip: 'bg-amber-700' },
  update: { label: 'Update', chip: 'bg-slate-700' },
};

const storageKey = (id: string) => `alert-dismissed:${id}`;

export default function AlertBanner({ alert }: { alert: SiteAlert | null }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!alert) return;
    if (Date.now() >= Date.parse(alert.expiresAt)) {
      setVisible(false);
      return;
    }
    try {
      if (localStorage.getItem(storageKey(alert.id))) setVisible(false);
    } catch {}
  }, [alert]);

  if (!alert || !visible) return null;

  const { label, chip } = LEVELS[alert.level];
  const published = new Date(alert.publishedAt);
  const stamp = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    hour12: false,
  }).format(published);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(storageKey(alert.id), '1');
    } catch {}
  };

  return (
    <section aria-label="Site alert" className="border-b bg-muted text-foreground">
      <div className="container mx-auto flex items-start gap-3 px-4 py-2.5 text-sm">
        <span className={`mt-0.5 shrink-0 rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white ${chip}`}>
          {label}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium leading-snug">{alert.headline}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            <time dateTime={alert.publishedAt}>Published {stamp} UTC</time>
            {alert.href && (
              <>
                {' · '}
                <Link href={alert.href} className="inline-flex items-center gap-1 font-medium text-primary underline-offset-2 hover:underline">
                  Read the full story <ArrowRight size={12} aria-hidden="true" />
                </Link>
              </>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss alert"
          className="-mr-1 shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X size={16} />
        </button>
      </div>
    </section>
  );
}
