import { listingMetadata } from "@/lib/seo";
import CategoryListing from "@/components/category-listing";

export const metadata = listingMetadata("/business");

export default function Page() {
  return <CategoryListing slug="business" page={1} />;
}
