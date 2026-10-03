import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { listingMetadata } from "@/lib/seo";
import { LISTING_SLUGS, categoryPageCount, isListingSlug } from "@/lib/listings";
import CategoryListing from "@/components/category-listing";

// Target of the `/<category>?page=N` rewrite in next.config.ts. Built ahead of time so listings can be cached.
export const dynamicParams = false;

export function generateStaticParams() {
  return LISTING_SLUGS.flatMap((category) =>
    Array.from({ length: categoryPageCount(category) }, (_, i) => ({ category, page: String(i + 1) })),
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
  return <CategoryListing slug={category} page={Number(page)} />;
}
