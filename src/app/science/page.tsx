import { getPostsByCategory } from "@/lib/posts";
import PostCard from "@/components/post-card";

export const metadata = {
  title: "Science & Technology News",
  description: "Scientific discoveries, research breakthroughs, and advanced technology trends.",
};

export default function ScienceTechPage() {
  const posts = getPostsByCategory("Science & Technology News");

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Science & Technology News</h1>
        <p className="text-muted-foreground">
          From space and physics to AI and computing—curated science and tech coverage.
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
          <p className="text-muted-foreground">No science & technology posts yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
