import type { Post } from '@/lib/posts';
import { getDisplaySummary } from '@/lib/key-points';

// Promo-code, coupon and shopping-deal roundups.
const PROMO_TITLE =
  /promo codes?|service codes?|coupons?|discount codes?|\d+% off|\bdeals\b|prime day|black friday|cyber monday|labor day sale|\bon sale\b/i;

const THIN_CHARS = 200;

// Short promo/deals pages add little beyond the source, so search engines are asked not to index
// them (readers can still open them). They are also left out of the sitemaps.
export function isThinPromo(post: Post): boolean {
  return PROMO_TITLE.test(post.title) && getDisplaySummary(post).length < THIN_CHARS;
}
