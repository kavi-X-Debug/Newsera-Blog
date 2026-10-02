import Link from "next/link";
import type { Metadata } from "next";
import { CATEGORIES } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">Error 404</p>
      <h1 className="text-4xl font-bold tracking-tight">We can&apos;t find that page</h1>
      <p className="text-muted-foreground">
        The link may be old or mistyped. Try the latest stories, search the site, or pick a section below.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
          Go to the home page
        </Link>
        <Link href="/search" className="rounded-md border px-5 py-2.5 text-sm font-medium hover:bg-accent">
          Search news
        </Link>
      </div>
      <nav aria-label="Sections" className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => (
          <Link key={c.href} href={c.href} className="rounded-full border px-4 py-1.5 text-sm hover:bg-accent">
            {c.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
