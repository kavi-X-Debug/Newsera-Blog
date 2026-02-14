export const metadata = {
  title: "Privacy Policy",
  description: "Read the privacy policy of Newsera.blog.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <div className="prose prose-slate dark:prose-invert">
        <p>Last updated: February 14, 2026</p>
        <p>
          At Newsera.blog, we take your privacy seriously. This policy outlines how we handle data and your interactions with our news service.
        </p>
        <h2 className="text-2xl font-bold mt-8">Data Collection</h2>
        <p>
          We do not require user registration or personal information to browse our news articles. We may use standard web analytics tools (like Google Analytics) to understand general traffic patterns and optimize our site for users in Tier-1 countries.
        </p>
        <h2 className="text-2xl font-bold mt-8">Monetization & Cookies</h2>
        <p>
          We use third-party advertising partners, such as Adsterra, to support our platform. These partners may use cookies or similar technologies to provide relevant advertisements based on your interests. We do not use aggressive pop-ups or automatic redirects.
        </p>
        <h2 className="text-2xl font-bold mt-8">External Links</h2>
        <p>
          Our posts may contain links to external websites, including original news sources and sponsored tools. We are not responsible for the privacy practices or content of these external sites.
        </p>
        <h2 className="text-2xl font-bold mt-8">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us through our contact page.
        </p>
      </div>
    </div>
  );
}
