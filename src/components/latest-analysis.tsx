import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { getAllAnalyses } from "@/lib/analysis";
import { getPostBySlug } from "@/lib/posts";
import { categoryPath } from "@/lib/categories";

export default function LatestAnalysis() {
  const items = getAllAnalyses()
    .map((a) => ({ a, post: getPostBySlug(a.slug) }))
    .filter((x) => x.post !== null)
    .slice(0, 3);
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="latest-analysis-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 id="latest-analysis-heading" className="text-2xl font-bold tracking-tight">Latest analysis</h2>
        <Link href="/analysis" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          All analysis <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map(({ a, post }) => (
          <article key={a.slug} className="relative rounded-xl border-2 border-primary/20 bg-primary/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{post!.category}</p>
            <h3 className="mt-1 font-bold leading-snug">
              <Link href={`/${categoryPath(post!.category)}/${post!.slug}`} className="after:absolute after:inset-0 hover:underline">
                {a.headline ?? post!.title}
              </Link>
            </h3>
            <p className="mt-2 text-xs text-muted-foreground">
              By {a.author} · <time dateTime={a.date}>{format(new Date(a.date), "MMM dd, yyyy")}</time>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
