export const metadata = {
  title: "Privacy Policy",
  description: "Read the privacy policy of News Era.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <div className="prose prose-slate dark:prose-invert">
        <p>Last updated: October 2, 2026</p>
        <p>
          At News Era, we take your privacy seriously. This policy outlines how we handle data and your interactions with our news service.
        </p>
        <h2 className="text-2xl font-bold mt-8">Data Collection</h2>
        <p>
          We do not require user registration or personal information to browse our news articles. We use Vercel Web Analytics to understand general traffic patterns (such as which pages are viewed). It does not use cookies to track you across sites.
        </p>
        <h2 className="text-2xl font-bold mt-8">Newsletter</h2>
        <p>
          If you choose to subscribe to our newsletter, we collect your email address and nothing else. We use it only to send you the newsletter, and we never sell or share it for advertising. Subscriptions are confirmed by a link we email to you (double opt-in). Your email address is stored and the newsletter is sent through our email provider, Buttondown, which processes it on our behalf. Every email contains an unsubscribe link, and you can also contact us to have your address removed.
        </p>
        <h2 className="text-2xl font-bold mt-8">Advertising & Cookies</h2>
        <p>
          We do not currently display third-party advertisements, and we do not use pop-ups or automatic redirects.
        </p>
        <h2 className="text-2xl font-bold mt-8">External Links</h2>
        <p>
          Our posts may contain links to external websites, such as the original news sources. We are not responsible for the privacy practices or content of these external sites.
        </p>
        <h2 className="text-2xl font-bold mt-8">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us through our contact page.
        </p>
      </div>
    </div>
  );
}
