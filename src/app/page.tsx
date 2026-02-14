import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/post-card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const allPosts = getAllPosts();
  const latestPosts = allPosts.slice(0, 5);

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
          The Future of <span className="text-primary">Tech</span> & <span className="text-blue-600 dark:text-blue-400">Security</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
          Automated news, insights, and analysis for the modern digital era. Stay ahead of the curve with Newsera.blog.
        </p>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Latest News</h2>
          <div className="flex gap-4">
            <Link href="/tech" className="text-sm font-medium hover:underline flex items-center gap-1">
              Tech <ArrowRight size={14} />
            </Link>
            <Link href="/cybersecurity" className="text-sm font-medium hover:underline flex items-center gap-1">
              Cybersecurity <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {latestPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No posts yet. Check back soon!</p>
          </div>
        )}
      </section>

      <section className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center space-y-6">
        <h2 className="text-3xl font-bold">Never Miss an Update</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We track the web's most reliable sources to bring you 3 essential updates every single day.
        </p>
        <div className="flex justify-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold">
                U{i}
              </div>
            ))}
          </div>
          <p className="text-sm font-medium flex items-center">Join 10,000+ tech enthusiasts</p>
        </div>
      </section>
    </div>
  );
}
