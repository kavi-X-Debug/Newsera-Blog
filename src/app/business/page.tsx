import { getPostsByCategory } from "@/lib/posts";
import PostCard from "@/components/post-card";
import Pagination from "@/components/pagination";
import { paginate } from "@/lib/pagination";

export const metadata = {
  title: "Business / Economic News",
  description: "Markets, earnings, and macroeconomic updates that shape global business.",
};

export default async function BusinessPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: rawPage } = await searchParams;
  const all = getPostsByCategory("Business / Economic News");
  const { items: posts, ...pager } = paginate(all, rawPage);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Business / Economic News</h1>
        <p className="text-muted-foreground">
          Financial markets, company reports, policy, and economic indicators.
        </p>
      </div>

      {all.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          <Pagination basePath="/business" {...pager} />
        </div>
      ) : (
        <div className="text-center py-20 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No business posts yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
