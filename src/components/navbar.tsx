'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tighter text-primary">Newsera<span className="text-muted-foreground">.blog</span></span>
          </Link>
          <div className="hidden md:flex gap-6">
            <Link href="/tech" className="text-sm font-medium transition-colors hover:text-primary">Tech</Link>
            <Link href="/cybersecurity" className="text-sm font-medium transition-colors hover:text-primary">Cybersecurity</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-md hover:bg-accent"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
          
          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b bg-background px-4 py-4 space-y-4">
          <Link href="/tech" className="block text-sm font-medium" onClick={() => setIsOpen(false)}>Tech</Link>
          <Link href="/cybersecurity" className="block text-sm font-medium" onClick={() => setIsOpen(false)}>Cybersecurity</Link>
        </div>
      )}
    </nav>
  );
}
