import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Newsera.blog</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted source for the latest in technology and cybersecurity news. Delivering insights daily.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2">
              <li><Link href="/tech" className="text-sm hover:text-primary transition-colors">Tech</Link></li>
              <li><Link href="/cybersecurity" className="text-sm hover:text-primary transition-colors">Cybersecurity</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/privacy" className="text-sm hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Newsera.blog. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
