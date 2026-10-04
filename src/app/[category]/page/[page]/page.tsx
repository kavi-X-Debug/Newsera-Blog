import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { listingMetadata } from "@/lib/seo";
import { LISTING_SLUGS, categoryPageCount, isListingSlug } from "@/lib/listings";
import { PRERENDER_LISTING_PAGES } from "@/lib/prerender";
import CategoryListing from "@/components/category-listing";

// Target of the `/<category>?page=N` rewrite in next.config.ts. The first pages are built ahead of time; later ones on first request, then cached.

export function generateStaticParams() {
  return LISTING_SLUGS.flatMap((category) =>
    Array.from({ length: Math.min(categoryPageCount(category), PRERENDER_LISTING_PAGES) }, (_, i) => ({ category, page: String(i + 1) })),
  );
}

type Params = Promise<{ category: string; page: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category, page } = await params;
  if (!isListingSlug(category)) return {};
  return listingMetadata(`/${category}`, page);
}

export default async function Page({ params }: { params: Params }) {
  const { category, page } = await params;
  if (!isListingSlug(category)) notFound();
  const n = Number(page);
  if (!Number.isInteger(n) || n < 1 || n > categoryPageCount(category)) notFound();
  return <CategoryListing slug={category} page={n} />;
}
