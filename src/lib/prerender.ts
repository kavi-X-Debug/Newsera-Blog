// Only the newest content is built ahead of time. Everything older is built the first time it is
// requested and then cached. This keeps each Vercel deployment small (the free plan has 10 GB of
// deployment storage in total) without changing any URLs.
export const PRERENDER_RECENT_POSTS = 150;
export const PRERENDER_LISTING_PAGES = 5;
