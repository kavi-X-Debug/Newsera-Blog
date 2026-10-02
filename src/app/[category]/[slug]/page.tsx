import { getPostBySlug, getAllPosts, Post } from "@/lib/posts";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { format } from "date-fns";
import { Shield, Cpu, Calendar, User, ExternalLink, ChevronLeft } from "lucide-react";
import Link from "next/link";
import JsonLd from "@/components/json-ld";
import ShareButtons from "@/components/share-buttons";
import { getKeyPoints } from "@/lib/key-points";
import NewsletterSignup from "@/components/newsletter-signup";
import { postKeywords, SITE_URL } from "@/lib/seo";
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
  const desc = (post.description && post.description.trim().length > 0)
    ? post.description
    : (post.content?.summary ? post.content.summary.slice(0, 160) : undefined);

  return {
    title: post.title,
    description: desc,
    keywords: postKeywords(post),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      section: post.category,
      tags: postKeywords(post),
      title: post.title,
      description: desc,
      publishedTime: post.date,
      authors: [post.author],
      images: post.image ? [{ url: post.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: desc,
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

  const keyPoints = getKeyPoints(post);
  const descriptionText =
    (post.description && post.description.trim().length > 0)
      ? post.description
      : (post.content?.summary ? post.content.summary.slice(0, 160) : "");

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

          <ShareButtons url={`${SITE_URL}/${categoryToPath(post.category)}/${post.slug}`} title={post.title} />

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">What Happened?</h2>
              <p className="text-lg leading-relaxed whitespace-pre-wrap">{post.content.summary}</p>
              <div className="pt-2">
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
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

            {keyPoints.length > 0 && (
              <section className="space-y-4 bg-muted/30 p-6 rounded-xl border">
                <h2 className="text-xl font-bold flex items-center gap-2">Key Takeaways</h2>
                <ul className="space-y-2 list-none p-0">
                  {keyPoints.map((item, index) => (
                    <li key={index} className="flex gap-3 items-start">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-0.5">
                        {index + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div className="border-t pt-6">
            <ShareButtons url={`${SITE_URL}/${categoryToPath(post.category)}/${post.slug}`} title={post.title} label="Share this article" />
          </div>

          <NewsletterSignup />

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
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "NewsArticle",
                "@id": `${SITE_URL}/${categoryToPath(post.category)}/${post.slug}#article`,
                headline: post.title.slice(0, 110),
                description: descriptionText,
                image: post.image ? [post.image] : [`${SITE_URL}/opengraph-image`],
                datePublished: post.date,
                dateModified: post.date,
                inLanguage: "en",
                isAccessibleForFree: true,
                articleSection: post.category,
                keywords: postKeywords(post).join(", "),
                author: { "@type": "Organization", name: "News Era", url: SITE_URL },
                publisher: {
                  "@type": "Organization",
                  name: "News Era",
                  logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.png` },
                },
                mainEntityOfPage: {
                  "@type": "WebPage",
                  "@id": `${SITE_URL}/${categoryToPath(post.category)}/${post.slug}`,
                },
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
                  { "@type": "ListItem", position: 2, name: post.category, item: `${SITE_URL}/${categoryToPath(post.category)}` },
                  { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/${categoryToPath(post.category)}/${post.slug}` },
                ],
              },
            ],
          }}
        />
    </div>
  );
}
