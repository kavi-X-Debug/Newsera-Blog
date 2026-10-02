import type { Post } from '@/lib/posts';
import { categoryPath } from '@/lib/categories';
import { getActiveAlert } from '@/lib/alert';

const FRESH_MS = 24 * 60 * 60 * 1000;

export interface BreakingStories {
  // True only when an editor has published an alert (content/alert.json) for the lead story.
  isBreaking: boolean;
  posts: Post[];
}

// "Breaking" is reserved for editor-flagged stories. Otherwise the section shows
// stories published in the last 24 hours as "Just in", and is hidden when there are none.
export function getBreakingStories(allPosts: Post[], limit = 4): BreakingStories {
  const alert = getActiveAlert();
  const lead = alert?.href
    ? allPosts.find((p) => `/${categoryPath(p.category)}/${p.slug}` === alert.href)
    : undefined;

  const cutoff = Date.now() - FRESH_MS;
  const fresh = allPosts.filter((p) => p !== lead && Date.parse(p.date) >= cutoff);

  const posts = (lead ? [lead, ...fresh] : fresh).slice(0, limit);
  return { isBreaking: Boolean(lead), posts };
}
