import type { Metadata } from "next";
import { listingMetadata } from "@/lib/seo";
import { getPostsByCategory } from "@/lib/posts";
import PostCard from "@/components/post-card";
import Pagination from "@/components/pagination";
import { paginate } from "@/lib/pagination";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { page } = await searchParams;
  return listingMetadata("/tech", page);
}

export default async function TechPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: rawPage } = await searchParams;
  const all = getPostsByCategory("Tech");
  const { items: posts, ...pager } = paginate(all, rawPage);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Technology</h1>
        <p className="text-muted-foreground">
          The latest innovations and updates from the world of tech.
        </p>
      </div>

      {all.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          <Pagination basePath="/tech" {...pager} />
        </div>
      ) : (
        <div className="text-center py-20 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No tech posts yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
