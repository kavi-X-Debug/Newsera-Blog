import { getPostsByCategory } from "@/lib/posts";
import PostCard from "@/components/post-card";

export const metadata = {
  title: "Sports News",
  description: "Latest scores, matches, and highlights across major sports.",
};

export default function SportsPage() {
  const posts = getPostsByCategory("Sports News");

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Sports News</h1>
        <p className="text-muted-foreground">
          Live updates, results, and stories from the world of sports.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No sports posts yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
