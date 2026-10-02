import { listingMetadata } from "@/lib/seo";
import CategoryListing from "@/components/category-listing";

export const metadata = listingMetadata("/cybersecurity");

export default function Page() {
  return <CategoryListing slug="cybersecurity" page={1} />;
}
