export const CATEGORIES = [
  { href: '/breaking', label: 'Breaking News', name: 'Breaking News' },
  { href: '/tech', label: 'Tech', name: 'Tech' },
  { href: '/cybersecurity', label: 'Cybersecurity', name: 'Cybersecurity' },
  { href: '/sports', label: 'Sports', name: 'Sports News' },
  { href: '/business', label: 'Business', name: 'Business / Economic News' },
  { href: '/politics', label: 'Politics', name: 'Political News' },
  { href: '/science', label: 'Science & Tech', name: 'Science & Technology News' },
] as const;

export function categoryPath(category: string): string {
  return CATEGORIES.find((c) => c.name === category)?.href.slice(1) ?? 'tech';
}
