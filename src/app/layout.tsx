import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Newsera.blog | Tech & Cybersecurity News",
    template: "%s | Newsera.blog"
  },
  description: "Stay updated with the latest in technology and cybersecurity. Automated news for the tech-savvy.",
  keywords: ["tech news", "cybersecurity", "automation", "newsera"],
  authors: [{ name: "Newsera Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://newsera.blog",
    siteName: "Newsera.blog",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
