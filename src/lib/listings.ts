import { getAllPosts, getPostsByCategory } from '@/lib/posts';
import { POSTS_PER_PAGE } from '@/lib/pagination';

export type ListingSlug = 'tech' | 'cybersecurity' | 'sports' | 'business' | 'politics' | 'science';

export const LISTINGS: Record<ListingSlug, { name: string; h1: string; intro: string; empty: string }> = {
  tech: {
    name: 'Tech',
    h1: 'Technology',
    intro: 'The latest innovations and updates from the world of tech.',
    empty: 'No tech posts yet. Check back soon!',
  },
  cybersecurity: {
    name: 'Cybersecurity',
    h1: 'Cybersecurity',
    intro: 'Stay protected with the latest security news and threat intelligence.',
    empty: 'No cybersecurity posts yet. Check back soon!',
  },
  sports: {
    name: 'Sports News',
    h1: 'Sports News',
    intro: 'Live updates, results, and stories from the world of sports.',
    empty: 'No sports posts yet. Check back soon!',
  },
  business: {
    name: 'Business / Economic News',
    h1: 'Business / Economic News',
    intro: 'Financial markets, company reports, policy, and economic indicators.',
    empty: 'No business posts yet. Check back soon!',
  },
  politics: {
    name: 'Political News',
    h1: 'Political News',
    intro: 'Key decisions, debates, and legislative updates shaping governance.',
    empty: 'No political posts yet. Check back soon!',
  },
  science: {
    name: 'Science & Technology News',
    h1: 'Science & Technology News',
    intro: 'From space and physics to AI and computing—curated science and tech coverage.',
    empty: 'No science & technology posts yet. Check back soon!',
  },
};

export const LISTING_SLUGS = Object.keys(LISTINGS) as ListingSlug[];

export const isListingSlug = (s: string): s is ListingSlug => s in LISTINGS;

export const pageCount = (total: number) => Math.max(1, Math.ceil(total / POSTS_PER_PAGE));

export function categoryPageCount(slug: ListingSlug): number {
  return pageCount(getPostsByCategory(LISTINGS[slug].name).length);
}

export function homePageCount(): number {
  return pageCount(getAllPosts().length);
}
