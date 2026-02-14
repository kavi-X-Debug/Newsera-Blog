import { getPostsByCategory } from "@/lib/posts";
import PostCard from "@/components/post-card";

export const metadata = {
  title: "Tech News",
  description: "Latest technology updates, gadget launches, and software breakthroughs.",
};

export default function TechPage() {
  const posts = getPostsByCategory("Tech");

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Technology</h1>
        <p className="text-muted-foreground">
          The latest innovations and updates from the world of tech.
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
          <p className="text-muted-foreground">No tech posts yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
