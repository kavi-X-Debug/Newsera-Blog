import { listingMetadata } from "@/lib/seo";
import CategoryListing from "@/components/category-listing";

export const metadata = listingMetadata("/science");

export default function Page() {
  return <CategoryListing slug="science" page={1} />;
}
