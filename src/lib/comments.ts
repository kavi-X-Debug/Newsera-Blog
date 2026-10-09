import { randomUUID, timingSafeEqual } from 'node:crypto';

/**
 * Reader comments, stored in Upstash Redis (free tier, added from the Vercel Marketplace).
 * Every comment is held as "pending" until the editor approves it on /admin/comments.
 *
 * Keys:
 *   comment:<id>        JSON of the comment
 *   approved:<slug>     sorted set of approved ids (score = created time)
 *   pending             sorted set of ids waiting for review
 */

export interface Comment {
  id: string;
  slug: string;
  name: string;
  body: string;
  createdAt: number;
}

export const MAX_NAME = 50;
export const MAX_BODY = 1500;
export const MIN_BODY = 3;

const URL_ = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

export const commentsEnabled = Boolean(URL_ && TOKEN);

type Cmd = (string | number)[];

async function run(commands: Cmd[]): Promise<unknown[]> {
  const res = await fetch(`${URL_}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
    cache: 'no-store',
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`Redis ${res.status}`);
  const out = (await res.json()) as { result?: unknown; error?: string }[];
  const failed = out.find((o) => o.error);
  if (failed) throw new Error(`Redis: ${failed.error}`);
  return out.map((o) => o.result);
}

function parse(raw: unknown): Comment | null {
  if (typeof raw !== 'string') return null;
  try {
    return JSON.parse(raw) as Comment;
  } catch {
    return null;
  }
}

async function load(ids: string[]): Promise<Comment[]> {
  if (!ids.length) return [];
  const rows = await run(ids.map((id) => ['GET', `comment:${id}`]));
  return rows.map(parse).filter((c): c is Comment => c !== null);
}

export async function getApproved(slug: string): Promise<Comment[]> {
  const [ids] = (await run([['ZRANGE', `approved:${slug}`, 0, 199]])) as [string[]];
  return load(ids);
}

export async function getPending(): Promise<Comment[]> {
  const [ids] = (await run([['ZRANGE', 'pending', 0, 99]])) as [string[]];
  return load(ids);
}

export async function addPending(slug: string, name: string, body: string): Promise<void> {
  const c: Comment = { id: randomUUID(), slug, name, body, createdAt: Date.now() };
  await run([
    ['SET', `comment:${c.id}`, JSON.stringify(c)],
    ['ZADD', 'pending', c.createdAt, c.id],
  ]);
}

export async function approve(id: string): Promise<boolean> {
  const [raw] = await run([['GET', `comment:${id}`]]);
  const c = parse(raw);
  if (!c) return false;
  await run([
    ['ZADD', `approved:${c.slug}`, c.createdAt, c.id],
    ['ZREM', 'pending', c.id],
  ]);
  return true;
}

export async function remove(id: string): Promise<boolean> {
  const [raw] = await run([['GET', `comment:${id}`]]);
  const c = parse(raw);
  if (!c) return false;
  await run([
    ['ZREM', 'pending', c.id],
    ['ZREM', `approved:${c.slug}`, c.id],
    ['DEL', `comment:${c.id}`],
  ]);
  return true;
}

/** Fixed-window limiter shared across all server instances. */
export async function tooManyRequests(ip: string, limit: number, windowSec: number): Promise<boolean> {
  const key = `rl:${ip}`;
  const [count] = (await run([['INCR', key], ['EXPIRE', key, windowSec, 'NX']])) as [number];
  return count > limit;
}

export function isAdmin(request: Request): boolean {
  const expected = process.env.COMMENTS_ADMIN_TOKEN;
  if (!expected || expected.length < 16) return false;
  const given = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

const LINK_RE = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|ru|cn|xyz|top|info|biz|co|me|ly|site|online)\b)/i;
export const hasLink = (s: string) => LINK_RE.test(s);
