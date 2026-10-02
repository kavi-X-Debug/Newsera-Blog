import type { Post } from '@/lib/posts';
import { categoryPath } from '@/lib/categories';
import { getActiveAlert } from '@/lib/alert';
import { BREAKING_WINDOW_MS } from '@/lib/breaking-window';
import { getAllPosts } from '@/lib/posts';

export interface BreakingStories {
  // True only when an editor has published an alert (content/alert.json) for the lead story.
  isBreaking: boolean;
  posts: Post[];
}

// Every story published within the breaking window (12h) is listed. The red "Breaking"
// label is still reserved for stories an editor flags in content/alert.json.
export function getRecentPosts(allPosts: Post[]): Post[] {
  const cutoff = Date.now() - BREAKING_WINDOW_MS;
  return allPosts.filter((p) => Date.parse(p.date) >= cutoff);
}

let latestDate: string | null | undefined;
// Memoised so the layout does not re-read every post file for each page it renders.
export function getLatestPostDate(): string | null {
  if (latestDate === undefined) latestDate = getAllPosts()[0]?.date ?? null;
  return latestDate;
}

export function getBreakingStories(allPosts: Post[], limit = 4): BreakingStories {
  const alert = getActiveAlert();
  const lead = alert?.href
    ? allPosts.find((p) => `/${categoryPath(p.category)}/${p.slug}` === alert.href)
    : undefined;

  const fresh = getRecentPosts(allPosts).filter((p) => p !== lead);

  const posts = (lead ? [lead, ...fresh] : fresh).slice(0, limit);
  return { isBreaking: Boolean(lead), posts };
}
