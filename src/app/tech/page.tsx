import { listingMetadata } from "@/lib/seo";
import CategoryListing from "@/components/category-listing";

export const metadata = listingMetadata("/tech");

export default function Page() {
  return <CategoryListing slug="tech" page={1} />;
}
