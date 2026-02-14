import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Shield, Cpu, Calendar, User, ExternalLink, ChevronLeft } from "lucide-react";
import Link from "next/link";
import PostCard from "@/components/post-card";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const Icon = post.category === "Cybersecurity" ? Shield : Cpu;
  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  // Adsterra Smartlink (Placeholder - User should replace with their actual link)
  const SMARTLINK_URL = "#"; 

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
        <ChevronLeft size={16} /> Back to Home
      </Link>

      <article className="space-y-8">
        <header className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider">
            <Icon size={14} />
            {post.category}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-6 text-sm text-muted-foreground border-y py-4">
            <span className="flex items-center gap-1.5">
              <Calendar size={16} />
              {format(new Date(post.date), "MMMM dd, yyyy")}
            </span>
            <span className="flex items-center gap-1.5">
              <User size={16} />
              {post.author}
            </span>
          </div>
        </header>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">What Happened?</h2>
            <p className="text-lg leading-relaxed">{post.content.summary}</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Why It Matters</h2>
            <p className="text-lg leading-relaxed">{post.content.impact}</p>
          </section>

          <section className="space-y-4 bg-muted/30 p-6 rounded-xl border">
            <h2 className="text-xl font-bold flex items-center gap-2">
              Key Takeaways
            </h2>
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

          {/* Monetization CTA */}
          <section className="py-8 text-center border-y">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Recommended for You</h3>
              <p className="text-muted-foreground">
                Enhance your digital security and stay protected with our recommended tools.
              </p>
              <a
                href={SMARTLINK_URL}
                target="_blank"
                rel="noopener noreferrer"
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
            <Link href={post.category === "Tech" ? "/tech" : "/cybersecurity"} className="text-sm text-primary hover:underline">
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

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": post.title,
            "datePublished": post.date,
            "author": {
              "@type": "Organization",
              "name": "Newsera.blog"
            },
            "description": post.description,
            "category": post.category
          })
        }}
      />
    </div>
  );
}
