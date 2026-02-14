import fs from 'fs';
import path from 'path';

export interface Post {
  title: string;
  slug: string;
  date: string;
  description: string;
  category: 'Tech' | 'Cybersecurity';
  content: {
    summary: string;
    impact: string;
    takeaways: string[];
  };
  link: string;
  author: string;
}

const postsDir = path.join(process.cwd(), 'content', 'posts');

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDir)) {
    return [];
  }
  const fileNames = fs.readdirSync(postsDir);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.json'))
    .map(fileName => {
      const filePath = path.join(postsDir, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContents) as Post;
    });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(postsDir, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents) as Post;
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter(
    post => post.category.toLowerCase() === category.toLowerCase()
  );
}
