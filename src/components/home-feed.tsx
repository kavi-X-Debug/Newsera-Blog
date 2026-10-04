import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/post-card";
import Pagination from "@/components/pagination";
import NewsletterSignup from "@/components/newsletter-signup";
import BreakingNews from "@/components/breaking-news";
import LatestAnalysis from "@/components/latest-analysis";
import { getBreakingStories } from "@/lib/breaking";
import { paginate } from "@/lib/pagination";
import { CATEGORIES } from "@/lib/categories";

export default function HomeFeed({ page }: { page: number }) {
  const allPosts = getAllPosts();
  const { items: latestPosts, ...pager } = paginate(allPosts, String(page));
  const breaking = pager.page === 1 ? getBreakingStories(allPosts) : null;

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
          The Future of <span className="text-primary">Tech</span> & <span className="text-blue-600 dark:text-blue-400">Security</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Daily tech news, cybersecurity alerts, AI updates, business and science headlines, each with a clear summary of what happened and why it matters.
        </p>
      </section>

      {breaking && <BreakingNews posts={breaking.posts} isBreaking={breaking.isBreaking} />}

      {pager.page === 1 && <LatestAnalysis />}

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Latest News</h2>
        </div>
        <nav aria-label="Browse by category" className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link key={c.href} href={c.href} className="rounded-full border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground">
              {c.label}
            </Link>
          ))}
        </nav>

        {latestPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post, i) => (
                <PostCard key={post.slug} post={post} index={breaking && breaking.posts.length > 0 ? 99 : i} />
              ))}
            </div>
            <Pagination basePath="/" {...pager} />
          </>
        ) : (
          <div className="text-center py-20 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No posts yet. Check back soon!</p>
          </div>
        )}
      </section>

      <NewsletterSignup />
    </div>
  );
}
