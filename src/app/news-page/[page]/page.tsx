import type { Metadata } from "next";
import { listingMetadata } from "@/lib/seo";
import { homePageCount } from "@/lib/listings";
import HomeFeed from "@/components/home-feed";

// Target of the `/?page=N` rewrite in next.config.ts. Built ahead of time so pages can be cached.
export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: homePageCount() }, (_, i) => ({ page: String(i + 1) }));
}

type Params = Promise<{ page: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { page } = await params;
  return listingMetadata("/", page);
}

export default async function Page({ params }: { params: Params }) {
  const { page } = await params;
  return <HomeFeed page={Number(page)} />;
}
