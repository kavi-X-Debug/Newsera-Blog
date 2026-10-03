import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description:
    "How News Era finds, summarizes and labels stories, how AI is used, what Breaking News means, and how we handle corrections.",
  alternates: { canonical: "/editorial-policy" },
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <h1 className="text-4xl font-bold tracking-tight">Editorial Policy</h1>
      <p className="text-muted-foreground">Last updated: October 2, 2026</p>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p>
          News Era is a news digest. We help readers keep up with technology, cybersecurity and related news by summarizing
          stories reported by other publications and sending readers to the original reporting. This page explains exactly how we work.
        </p>

        <h2 className="text-2xl font-bold mt-8">What we publish</h2>
        <p>
          We do not currently do original reporting. Each article on News Era is a short summary of a story first published by
          another outlet. Every article names the source and links to the original, and we encourage readers to read the full story there.
        </p>

        <h2 className="text-2xl font-bold mt-8">Where stories come from</h2>
        <p>
          Stories are collected automatically from the public RSS feeds of TechCrunch, The Verge, Wired, The Hacker News,
          BleepingComputer and Dark Reading. We use only the short excerpt those feeds publish, never the full article.
        </p>

        <h2 className="text-2xl font-bold mt-8">How AI is used</h2>
        <p>
          The &quot;Key Takeaways&quot; on many articles are written by an AI model (Google Gemini) from the source excerpt alone. The model is
          instructed not to add facts, names or numbers that are not in that excerpt, and automated checks reject summaries that introduce
          new numbers. Articles with an AI-written summary say so on the page. AI can still make mistakes, so the original source is always
          the authority. If a summary is wrong, please tell us.
        </p>

        <h2 className="text-2xl font-bold mt-8">Categories and Breaking News</h2>
        <p>
          Categories are assigned automatically from the source feed and keywords in the story, so a story is occasionally filed under the wrong
          section. The <Link href="/breaking">Breaking News</Link> page lists every story published in the last 12 hours; after that a story
          moves to its category page. A red &quot;Breaking alert&quot; tag is added only when an editor decides a story is especially urgent.
        </p>

        <h2 className="text-2xl font-bold mt-8">Independence and funding</h2>
        <p>
          News Era currently shows no advertising and publishes no sponsored content. The newsletter is free. If that changes, we will say
          so clearly on this page and label any sponsored or affiliate content on the page where it appears.
        </p>

        <h2 className="text-2xl font-bold mt-8">Corrections and complaints</h2>
        <p>
          We fix errors openly. See our <Link href="/corrections">corrections policy</Link> to report a mistake or ask for a story to be
          changed or removed. You can also reach us on the <Link href="/contact">contact page</Link>.
        </p>
      </div>
    </div>
  );
}
