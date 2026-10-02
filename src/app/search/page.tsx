import type { Metadata } from "next";
import { searchPosts } from "@/lib/posts";
import PostCard from "@/components/post-card";
import Pagination from "@/components/pagination";
import { paginate } from "@/lib/pagination";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
  alternates: { canonical: "/search" },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page: rawPage } = await searchParams;
  const query = q.trim().slice(0, 100);
  const results = query ? searchPosts(query) : [];
  const { items: posts, ...pager } = paginate(results, rawPage);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {query ? <>Search results for “{query}”</> : "Search"}
        </h1>
        {query && (
          <p className="text-muted-foreground" aria-live="polite">
            {results.length} {results.length === 1 ? "article" : "articles"} found
          </p>
        )}
      </div>

      {!query ? (
        <div className="text-center py-20 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">Type a keyword in the search box to find news.</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20 border rounded-lg bg-muted/20 space-y-2">
          <p className="font-medium">No articles match “{query}”.</p>
          <p className="text-sm text-muted-foreground">Try fewer or different keywords.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          <Pagination basePath="/search" params={{ q: query }} {...pager} />
        </div>
      )}
    </div>
  );
}
