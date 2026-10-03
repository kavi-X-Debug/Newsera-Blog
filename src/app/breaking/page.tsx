import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { getRecentPosts } from "@/lib/breaking";
import { BREAKING_WINDOW_HOURS } from "@/lib/breaking-window";
import { listingMetadata } from "@/lib/seo";
import PostCard from "@/components/post-card";

// Rebuilt in the background every 5 minutes; stories drop off 12 hours after they are published.
export const revalidate = 300;

const MAX_STORIES = 30;

export function generateMetadata(): Metadata {
  const meta = listingMetadata("/breaking");
  // An empty page would be a thin page, so only let search engines index it while it has stories.
  return getRecentPosts(getAllPosts()).length > 0 ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default function BreakingPage() {
  const all = getRecentPosts(getAllPosts());
  const posts = all.slice(0, MAX_STORIES);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Breaking News</h1>
        <p className="text-muted-foreground">
          Stories published in the last {BREAKING_WINDOW_HOURS} hours. After that they move to their usual category page.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <PostCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border rounded-lg bg-muted/20 space-y-3">
          <p className="font-medium">No breaking news right now.</p>
          <p className="text-sm text-muted-foreground">
            Nothing has been published in the last {BREAKING_WINDOW_HOURS} hours. New stories appear here as soon as they are posted.
          </p>
          <Link href="/" className="inline-block text-sm font-medium text-primary underline-offset-4 hover:underline">
            Browse the latest stories
          </Link>
        </div>
      )}
    </div>
  );
}
