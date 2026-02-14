import { Mail, Globe, Shield } from "lucide-react";

export const metadata = {
  title: "Contact",
  description: "Get in touch with the News Era team.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
      <p className="text-xl text-muted-foreground">
        Have questions, feedback, or business inquiries? We'd love to hear from you.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="border rounded-xl p-6 space-y-4 bg-card">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Mail size={24} />
          </div>
          <h2 className="text-xl font-bold">Email Support</h2>
          <p className="text-muted-foreground">
            For general inquiries and support, reach out to us at:
          </p>
          <p className="font-semibold text-primary">
            <a href="mailto:kavishchathur2002@gmail.com" className="hover:underline">
              kavishchathur2002@gmail.com
            </a>
          </p>
        </div>

        <div className="border rounded-xl p-6 space-y-4 bg-card">
          <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600">
            <Shield size={24} />
          </div>
          <h2 className="text-xl font-bold">Partnerships</h2>
          <p className="text-muted-foreground">
            For advertising or partnership opportunities, contact:
          </p>
          <p className="font-semibold text-blue-600">
            <a href="mailto:kavishchathur2002@gmail.com" className="hover:underline">
              kavishchathur2002@gmail.com
            </a>
          </p>
        </div>
      </div>

      <div className="border rounded-xl p-8 bg-muted/20 text-center">
        <h2 className="text-2xl font-bold mb-4">Follow Our Updates</h2>
        <p className="text-muted-foreground mb-6">
          News Era is constantly evolving. Stay tuned for more features and updates.
        </p>
        <div className="flex justify-center gap-6">
          <Globe className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
          <Shield className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
        </div>
      </div>
    </div>
  );
}
