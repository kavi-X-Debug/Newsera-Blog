import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Analysis {
  slug: string; // the story's slug
  headline: string | null;
  author: string;
  date: string; // ISO
  body: string;
}

const dir = path.join(process.cwd(), 'content', 'analysis');
const SAFE = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

function read(slug: string): Analysis | null {
  if (!SAFE.test(slug) || slug.includes('..')) return null;
  const file = path.join(dir, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  const body = content.trim();
  if (!body) return null;
  const parsed = data.date ? new Date(data.date as string | Date) : new Date(fs.statSync(file).mtime);
  return {
    slug,
    headline: typeof data.headline === 'string' && data.headline.trim() ? data.headline.trim() : null,
    author: typeof data.author === 'string' && data.author.trim() ? data.author.trim() : 'News Era Team',
    date: (Number.isNaN(parsed.getTime()) ? new Date() : parsed).toISOString(),
    body,
  };
}

// An editor's own analysis of a story, from content/analysis/<story-slug>.md.
export function getAnalysis(slug: string): Analysis | null {
  return read(slug);
}

export function getAllAnalyses(): Analysis[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((f) => read(f.slice(0, -3)))
    .filter((a): a is Analysis => a !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
