import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const categoryPath =
    post.category === "Cybersecurity" ? "cybersecurity" :
    post.category === "Tech" ? "tech" :
    post.category === "Sports News" ? "sports" :
    post.category === "Business / Economic News" ? "business" :
    post.category === "Political News" ? "politics" :
    post.category === "Science & Technology News" ? "science" : "tech";
  const canonicalUrl = `https://newsera.blog/${categoryPath}/${post.slug}`;

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

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    notFound();
  }
  const categoryPath =
    post.category === "Cybersecurity" ? "cybersecurity" :
    post.category === "Tech" ? "tech" :
    post.category === "Sports News" ? "sports" :
    post.category === "Business / Economic News" ? "business" :
    post.category === "Political News" ? "politics" :
    post.category === "Science & Technology News" ? "science" : "tech";
  redirect(`/${categoryPath}/${post.slug}`);
}
