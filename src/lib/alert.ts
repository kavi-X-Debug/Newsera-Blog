import fs from 'fs';
import path from 'path';
import { getPostBySlug } from '@/lib/posts';
import { categoryPath } from '@/lib/categories';

export type AlertLevel = 'breaking' | 'security' | 'update';

export interface SiteAlert {
  id: string;
  level: AlertLevel;
  headline: string;
  href: string;
  publishedAt: string;
  expiresAt: string;
}

const MAX_LIFETIME_MS = 72 * 60 * 60 * 1000;
const DEFAULT_LIFETIME_MS = 24 * 60 * 60 * 1000;
const LEVELS: AlertLevel[] = ['breaking', 'security', 'update'];

// Alerts are published by an editor (content/alert.json), never inferred automatically,
// and always expire so a stale alert cannot linger.
export function getActiveAlert(): SiteAlert | null {
  const file = path.join(process.cwd(), 'content', 'alert.json');
  if (!fs.existsSync(file)) return null;

  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
  if (raw.enabled !== true) return null;

  const published = Date.parse(String(raw.publishedAt ?? ''));
  if (Number.isNaN(published)) return null;

  const requestedExpiry = Date.parse(String(raw.expiresAt ?? ''));
  const expires = Math.min(
    Number.isNaN(requestedExpiry) ? published + DEFAULT_LIFETIME_MS : requestedExpiry,
    published + MAX_LIFETIME_MS,
  );
  if (Date.now() >= expires) return null;

  const post = typeof raw.slug === 'string' && raw.slug ? getPostBySlug(raw.slug) : null;
  const headline = (typeof raw.headline === 'string' && raw.headline.trim()) || post?.title;
  if (!headline) return null;

  let href = '';
  if (post) href = `/${categoryPath(post.category)}/${post.slug}`;
  else if (typeof raw.href === 'string' && raw.href.startsWith('/')) href = raw.href;

  const level = LEVELS.includes(raw.level as AlertLevel) ? (raw.level as AlertLevel) : 'update';

  return {
    id: String(raw.id || raw.publishedAt),
    level,
    headline: headline.slice(0, 160),
    href,
    publishedAt: new Date(published).toISOString(),
    expiresAt: new Date(expires).toISOString(),
  };
}
