import { listingMetadata } from "@/lib/seo";
import HomeFeed from "@/components/home-feed";

// Rebuilt in the background every 5 minutes so the "Breaking News" section (a 12-hour window) stays current.
export const revalidate = 300;

export const metadata = listingMetadata("/");

export default function Home() {
  return <HomeFeed page={1} />;
}
