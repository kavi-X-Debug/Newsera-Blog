import fs from 'fs';
import path from 'path';

export interface Post {
  title: string;
  slug: string;
  date: string;
  description: string;
  category:
    | 'Tech'
    | 'Cybersecurity'
    | 'Sports News'
    | 'Business / Economic News'
    | 'Political News'
    | 'Science & Technology News';
  image?: string | null;
  content: {
    summary: string;
    impact: string;
    takeaways: string[];
    keyPoints?: string[];
    keyPointsBy?: string;
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

export function searchPosts(query: string): Post[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const scored: { post: Post; score: number }[] = [];
  for (const post of getAllPosts()) {
    const title = post.title.toLowerCase();
    const rest = [post.description, post.content?.summary, post.category, post.author]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    let score = 0;
    let matchesAll = true;
    for (const term of terms) {
      if (title.includes(term)) score += 3;
      else if (rest.includes(term)) score += 1;
      else {
        matchesAll = false;
        break;
      }
    }
    if (matchesAll) scored.push({ post, score });
  }

  // Stable sort keeps the newest-first order among equal scores.
  return scored.sort((a, b) => b.score - a.score).map((s) => s.post);
}
