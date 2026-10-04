import Link from "next/link";
import type { Metadata } from "next";
import { format } from "date-fns";
import { getAllAnalyses } from "@/lib/analysis";
import { getPostBySlug } from "@/lib/posts";
import { categoryPath } from "@/lib/categories";

export function generateMetadata(): Metadata {
  const hasAny = getAllAnalyses().length > 0;
  return {
    title: "Analysis – What the Biggest Tech and Security Stories Mean",
    description: "News Era's own analysis of important tech and cybersecurity stories: what happened, why it matters, and what to do about it.",
    alternates: { canonical: "/analysis" },
    robots: hasAny ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default function AnalysisPage() {
  const items = getAllAnalyses()
    .map((a) => ({ a, post: getPostBySlug(a.slug) }))
    .filter((x) => x.post !== null);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Analysis</h1>
        <p className="text-muted-foreground">Our own take on the stories that matter most: what happened, why it matters, and what to do.</p>
      </div>

      {items.length > 0 ? (
        <ul className="space-y-6">
          {items.map(({ a, post }) => {
            const href = `/${categoryPath(post!.category)}/${post!.slug}`;
            return (
              <li key={a.slug} className="rounded-xl border bg-card p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">{post!.category}</p>
                <h2 className="mt-1 text-xl font-bold leading-snug">
                  <Link href={href} className="hover:underline">{a.headline ?? post!.title}</Link>
                </h2>
                <p className="mt-2 line-clamp-3 text-muted-foreground">{a.body.replace(/[#*\[\]()]/g, "").slice(0, 280)}…</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  By {a.author} · <time dateTime={a.date}>{format(new Date(a.date), "MMMM dd, yyyy")}</time>
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="rounded-lg border bg-muted/20 py-20 text-center">
          <p className="text-muted-foreground">Analysis pieces will appear here soon.</p>
        </div>
      )}
    </div>
  );
}
