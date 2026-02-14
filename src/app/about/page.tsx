export const metadata = {
  title: "About Us",
  description: "Learn more about Newsera.blog and our mission to provide the latest tech and cybersecurity news.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <h1 className="text-4xl font-bold tracking-tight">About Newsera.blog</h1>
      <div className="prose prose-slate dark:prose-invert lg:prose-xl">
        <p>
          Newsera.blog is a premier news platform dedicated to bringing you the most relevant updates in Technology and Cybersecurity.
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
          We aim to publish 3 essential posts every single day, ensuring you stay informed without being overwhelmed. Whether it's a major tech breakthrough or a critical security vulnerability, Newsera.blog has you covered.
        </p>
      </div>
    </div>
  );
}
