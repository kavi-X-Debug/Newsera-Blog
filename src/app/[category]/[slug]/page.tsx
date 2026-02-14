import { getPostBySlug, getAllPosts, Post } from "@/lib/posts";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { format } from "date-fns";
import { Shield, Cpu, Calendar, User, ExternalLink, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import PostCard from "@/components/post-card";

function categoryToPath(category: Post["category"]): string {
  switch (category) {
    case "Cybersecurity":
      return "cybersecurity";
    case "Tech":
      return "tech";
    case "Sports News":
      return "sports";
    case "Business / Economic News":
      return "business";
    case "Political News":
      return "politics";
    case "Science & Technology News":
      return "science";
    default:
      return "tech";
  }
}

function pathToCanonicalCategory(path: string): Post["category"] | null {
  switch (path.toLowerCase()) {
    case "cybersecurity":
      return "Cybersecurity";
    case "tech":
      return "Tech";
    case "sports":
      return "Sports News";
    case "business":
      return "Business / Economic News";
    case "politics":
      return "Political News";
    case "science":
      return "Science & Technology News";
    default:
      return null;
  }
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    category: categoryToPath(post.category),
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const canonicalPath = `/${categoryToPath(post.category)}/${post.slug}`;
  const canonicalUrl = `https://newsera.blog${canonicalPath}`;

  return {
    title: post.title,
    description: post.description?.slice(0, 160),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [post.author],
      images: post.image ? [{ url: post.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : undefined,
      site: "@newsera_blog",
    },
  };
}

export default async function PostByCategoryPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const canonicalCategory = pathToCanonicalCategory(category);
  if (!canonicalCategory) notFound();

  // If the URL category doesn't match the post's actual category, redirect to the canonical one
  if (canonicalCategory !== post.category) {
    redirect(`/${categoryToPath(post.category)}/${post.slug}`);
  }

  const Icon = post.category === "Cybersecurity" ? Shield : Cpu;
  const allPosts = getAllPosts();
  const sameCategory = allPosts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 3);
  const crossCategory =
    sameCategory.length < 3
      ? allPosts.filter((p) => p.slug !== post.slug && p.category !== post.category).slice(0, 3 - sameCategory.length)
      : [];
  const relatedPosts = [...sameCategory, ...crossCategory];

  const SMARTLINK_URL = "https://www.effectivegatecpm.com/p428afnuf?key=e9e0ec5bd99ea342a1f5a24c3a632855";

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <article className="lg:col-span-2 space-y-8">
          <div className="aspect-video w-full bg-muted rounded-2xl flex items-center justify-center relative overflow-hidden mb-8 border">
            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
                <Icon size={120} className="text-primary/20 relative z-10" />
              </>
            )}
          </div>

          <header className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider">
              <Icon size={14} />
              {post.category}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">{post.title}</h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground border-y py-4">
              <span className="flex items-center gap-1.5">
                <Calendar size={16} />
                {format(new Date(post.date), "MMMM dd, yyyy")}
              </span>
              <span className="flex items-center gap-1.5">
                <User size={16} />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                Last updated: {format(new Date(post.date), "MMMM dd, yyyy")}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              By News Era Team — Independent tech and cybersecurity news for US/UK/CA/AU readers.
            </div>
          </header>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">What Happened?</h2>
              <p className="text-lg leading-relaxed whitespace-pre-wrap">{post.content.summary}</p>
              <div className="pt-2">
                <a
                  href={SMARTLINK_URL}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 text-sm font-medium"
                >
                  Read full article on source <ExternalLink size={14} />
                </a>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Why It Matters</h2>
              <p className="text-lg leading-relaxed">{post.content.impact}</p>
            </section>

            <section className="space-y-4 bg-muted/30 p-6 rounded-xl border">
              <h2 className="text-xl font-bold flex items-center gap-2">Key Takeaways</h2>
              <ul className="space-y-2 list-none p-0">
                {post.content.takeaways.map((item, index) => (
                  <li key={index} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-0.5">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="py-8 text-center border-y">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Recommended for You</h3>
                <p className="text-muted-foreground">
                  Enhance your digital security and stay protected with our recommended tools.
                </p>
                <a
                  href={SMARTLINK_URL}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-opacity shadow-lg"
                >
                  {post.category === "Cybersecurity" ? "Protect Your Device" : "Check Recommended Tool"}
                  <ExternalLink size={20} />
                </a>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Sponsored Content</p>
              </div>
            </section>
          </div>

          <footer className="pt-8 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Related Posts</h3>
              <Link
                href={`/${categoryToPath(post.category)}`}
                className="text-sm text-primary hover:underline"
              >
                View all {post.category} news
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </footer>
        </article>
      </div>
      <Script
        id="post-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["Article", "NewsArticle"],
            "headline": post.title,
            "datePublished": post.date,
            "author": {
              "@type": "Organization",
              "name": "News Era"
            },
            "description": post.description,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://newsera.blog/${categoryToPath(post.category)}/${post.slug}`
            }
          })
        }}
      />
    </div>
  );
}
