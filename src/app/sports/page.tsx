import { listingMetadata } from "@/lib/seo";
import CategoryListing from "@/components/category-listing";

export const metadata = listingMetadata("/sports");

export default function Page() {
  return <CategoryListing slug="sports" page={1} />;
}
