'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CATEGORIES } from '@/lib/categories';

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tighter text-primary">News Era</span>
          </Link>
          <div className="hidden md:flex gap-6">
            {CATEGORIES.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                aria-current={isActive(c.href) ? 'page' : undefined}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(c.href) ? 'text-primary underline underline-offset-8 decoration-2' : ''
                }`}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-md hover:bg-accent"
              aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}

          <button
            className="md:hidden p-2 rounded-md hover:bg-accent"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div id="mobile-menu" className="md:hidden border-b bg-background px-4 py-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              aria-current={isActive(c.href) ? 'page' : undefined}
              className={`block py-3 text-base font-medium border-b last:border-b-0 ${
                isActive(c.href) ? 'text-primary' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              {c.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
