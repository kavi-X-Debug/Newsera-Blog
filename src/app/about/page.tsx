export const metadata = {
  title: "About",
  description: "Learn more about News Era and our mission to provide the latest tech and cybersecurity news.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <h1 className="text-4xl font-bold tracking-tight">About News Era</h1>
      <div className="prose prose-slate dark:prose-invert lg:prose-xl">
        <p>
          News Era is an independent news digest that helps readers keep up with technology, cybersecurity and AI news.
        </p>
        <p>
          Our mission is to filter through the noise of the digital world and deliver high-quality, structured insights that matter to tech enthusiasts and security professionals alike, specifically tailored for our audience in the US, UK, Canada, and Australia.
        </p>
        <h2 className="text-2xl font-bold mt-8">How It Works</h2>
        <p>
          We monitor the latest news from world-renowned sources like TechCrunch, The Verge, Wired, and specialized security outlets. Each post is carefully categorized, summarized, and structured to provide you with the essential "What Happened" and "Why It Matters" without the fluff.
        </p>
        <h2 className="text-2xl font-bold mt-8">Our Goal</h2>
        <p>
          We add new stories several times a day, always linking to the original reporting. See our editorial policy for exactly how stories are collected, how AI is used and how we handle corrections.
        </p>
        <p>
          <a href="/editorial-policy">Editorial policy</a> · <a href="/corrections">Corrections &amp; feedback</a> · <a href="/contact">Contact</a>
        </p>
      </div>
    </div>
  );
}
