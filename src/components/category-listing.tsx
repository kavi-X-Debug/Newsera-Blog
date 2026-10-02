import { getPostsByCategory } from '@/lib/posts';
import { LISTINGS, type ListingSlug } from '@/lib/listings';
import { paginate } from '@/lib/pagination';
import PostCard from '@/components/post-card';
import Pagination from '@/components/pagination';

export default function CategoryListing({ slug, page }: { slug: ListingSlug; page: number }) {
  const cfg = LISTINGS[slug];
  const all = getPostsByCategory(cfg.name);
  const { items: posts, ...pager } = paginate(all, String(page));

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{cfg.h1}</h1>
        <p className="text-muted-foreground">{cfg.intro}</p>
      </div>

      {all.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
          </div>
          <Pagination basePath={`/${slug}`} {...pager} />
        </div>
      ) : (
        <div className="text-center py-20 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">{cfg.empty}</p>
        </div>
      )}
    </div>
  );
}
