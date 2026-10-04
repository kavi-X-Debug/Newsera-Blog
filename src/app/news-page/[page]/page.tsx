import type { Metadata } from "next";
import { listingMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { homePageCount } from "@/lib/listings";
import { PRERENDER_LISTING_PAGES } from "@/lib/prerender";
import HomeFeed from "@/components/home-feed";

// Target of the `/?page=N` rewrite in next.config.ts. The first pages are built ahead of time; later ones on first request, then cached.

export function generateStaticParams() {
  return Array.from({ length: Math.min(homePageCount(), PRERENDER_LISTING_PAGES) }, (_, i) => ({ page: String(i + 1) }));
}

type Params = Promise<{ page: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { page } = await params;
  return listingMetadata("/", page);
}

export default async function Page({ params }: { params: Params }) {
  const { page } = await params;
  const n = Number(page);
  if (!Number.isInteger(n) || n < 1 || n > homePageCount()) notFound();
  return <HomeFeed page={n} />;
}
