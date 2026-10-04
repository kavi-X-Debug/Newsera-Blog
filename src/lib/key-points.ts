import type { Post } from '@/lib/posts';

// Boilerplate the feed importer leaves at the end of a summary.
const TRAILERS: RegExp[] = [
  /\bRead the full story at\b.*$/i,
  /\bThe post\b.*\bappeared first on\b.*$/i,
  /\bThe post\b.*$/i,
  /\bContinue reading\b.*$/i,
  /\bRead more\b.*$/i,
  /\[(?:…|\.\.\.)\]/g,
];

// A segment ending like this is an abbreviation, not the end of a sentence.
const ABBREVIATION =
  /(?:\b(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|Mt|Gen|Sen|Rep|Gov|Lt|Col|Capt|Sgt|Inc|Corp|Co|Ltd|vs|No|Fig|approx|est)\.|\b(?:[A-Za-z]\.){2,}|\b[A-Z]\.|\b[ap]\.m\.|\b(?:e\.g|i\.e)\.)$/;

const MIN_LENGTH = 25;
const segmenter = new Intl.Segmenter('en', { granularity: 'sentence' });

function clean(text: string): string {
  let t = text.replace(/\s+/g, ' ').trim();
  // The importer always appends "..." to the stored summary, even when nothing was cut off.
  t = t.replace(/\.\.\.$/, '').trim();
  for (const re of TRAILERS) t = t.replace(re, '').trim();
  return t;
}

function sentences(text: string): string[] {
  const out: string[] = [];
  for (const { segment } of segmenter.segment(text)) {
    const s = segment.trim();
    if (!s) continue;
    if (out.length > 0 && ABBREVIATION.test(out[out.length - 1])) out[out.length - 1] += ' ' + s;
    else out.push(s);
  }
  return out;
}

// Up to `max` complete sentences from the article's own text. Nothing is invented or padded:
// a story with only one usable sentence returns one.
export function getKeyPoints(post: Post, max = 3): string[] {
  const text = clean(post.content?.summary || post.description || '');
  const points: string[] = [];

  for (const s of sentences(text)) {
    // Skip fragments, and truncated sentences (no closing punctuation, or cut off by an ellipsis).
    if (s.length < MIN_LENGTH) continue;
    if (!/[.!?]["”’')\]]?$/.test(s) || /(?:…|\.\.\.)["”’')\]]?$/.test(s)) continue;
    points.push(s);
    if (points.length === max) break;
  }
  return points;
}

// Prefers the AI-written key points saved with the post; otherwise falls back to the article's own sentences.
export function getKeyPointsInfo(post: Post, max = 3): { points: string[]; ai: boolean } {
  const stored = post.content?.keyPoints;
  if (stored && stored.length > 0 && post.content.keyPointsBy === 'gemini') {
    return { points: stored.slice(0, max), ai: true };
  }
  return { points: getKeyPoints(post, max), ai: false };
}

// The summary text for display: importer leftovers removed and, when possible, only complete sentences.
export function getDisplaySummary(post: Post): string {
  const text = clean(post.content?.summary || post.description || '');
  const complete = sentences(text).filter((x) => /[.!?]["”’')\]]?$/.test(x) && !/(?:…|\.\.\.)["”’')\]]?$/.test(x));
  return complete.length > 0 ? complete.join(' ') : text;
}

// The "Why It Matters" text is the same template on every imported post, so it is not shown.
export function hasOriginalImpact(post: Post): boolean {
  const impact = post.content?.impact?.trim();
  return Boolean(impact) && !impact!.startsWith('The implications of this');
}

export function getSourceName(post: Post): string | null {
  try {
    return new URL(post.link).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

// A search-result description made of complete sentences (or cut at a word with "…"), at most `max` characters.
export function getMetaDescription(post: Post, max = 155): string {
  const text = getDisplaySummary(post);
  let out = '';
  for (const s of sentences(text)) {
    if (!/[.!?]["”’')\]]?$/.test(s)) break;
    const next = out ? `${out} ${s}` : s;
    if (next.length > max) break;
    out = next;
  }
  if (!out) {
    const base = (text || post.description || post.title).replace(/\s+/g, ' ').trim();
    if (base.length <= max) {
      out = base;
    } else {
      const cut = base.slice(0, max - 1);
      const at = cut.lastIndexOf(' ');
      out = `${(at > 60 ? cut.slice(0, at) : cut).replace(/[,;:\s]+$/, '')}…`;
    }
  }
  if (out.length < 50) out = `${post.title.replace(/[.!?\s]+$/, '')}. ${out}`.trim().slice(0, max);
  return out;
}
