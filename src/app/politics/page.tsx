import { listingMetadata } from "@/lib/seo";
import CategoryListing from "@/components/category-listing";

export const metadata = listingMetadata("/politics");

export default function Page() {
  return <CategoryListing slug="politics" page={1} />;
}
