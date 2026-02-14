import { getPostsByCategory } from "@/lib/posts";
import PostCard from "@/components/post-card";

export const metadata = {
  title: "Cybersecurity News",
  description: "Critical security alerts, vulnerability disclosures, and cyber threat analysis.",
};

export default function CybersecurityPage() {
  const posts = getPostsByCategory("Cybersecurity");

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Cybersecurity</h1>
        <p className="text-muted-foreground">
          Stay protected with the latest security news and threat intelligence.
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
          <p className="text-muted-foreground">No cybersecurity posts yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
