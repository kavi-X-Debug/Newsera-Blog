import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Corrections & Feedback",
  description: "How to report an error or request a change or removal on News Era, and how we handle corrections.",
  alternates: { canonical: "/corrections" },
};

export default function CorrectionsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <h1 className="text-4xl font-bold tracking-tight">Corrections &amp; Feedback</h1>
      <p className="text-muted-foreground">Last updated: October 2, 2026</p>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold mt-4">Report an error</h2>
        <p>
          If you think a summary on News Era is inaccurate, misleading, or filed in the wrong category, email{" "}
          <a href="mailto:kavishchathur2002@gmail.com">kavishchathur2002@gmail.com</a> with the link to the article and what is wrong.
          Please include a link to a source that shows the correct information if you can.
        </p>

        <h2 className="text-2xl font-bold mt-8">What we do</h2>
        <ul>
          <li>We review reports and compare the summary with the original source.</li>
          <li>If the summary is wrong, we correct it, or remove the story if it cannot be fixed.</li>
          <li>When a correction changes the meaning of a story, we note the change on the article.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8">Publishers and rights holders</h2>
        <p>
          News Era shows only short excerpts and links to the original. If you publish one of the sources we summarize and would like a story
          changed or removed, email the address above and we will act promptly.
        </p>

        <h2 className="text-2xl font-bold mt-8">More about how we work</h2>
        <p>
          Read our <Link href="/editorial-policy">editorial policy</Link> for how stories are collected, how AI is used, and what labels like
          &quot;Breaking News&quot; mean.
        </p>
      </div>
    </div>
  );
}
