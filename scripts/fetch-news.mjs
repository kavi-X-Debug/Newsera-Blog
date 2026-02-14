import Parser from 'rss-parser';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const parser = new Parser();

const FEEDS = [
  { url: 'https://techcrunch.com/feed/', category: 'Tech' },
  { url: 'https://www.theverge.com/rss/index.xml', category: 'Tech' },
  { url: 'https://www.wired.com/feed/rss', category: 'Tech' },
  { url: 'https://thehackernews.com/rss.xml', category: 'Cybersecurity' },
  { url: 'https://www.bleepingcomputer.com/feed/', category: 'Cybersecurity' },
  { url: 'https://www.darkreading.com/rss.xml', category: 'Cybersecurity' }
];

const CYBER_KEYWORDS = ['security', 'hacker', 'cyber', 'vulnerability', 'breach', 'exploit', 'malware', 'ransomware', 'attack', 'patch'];
const TECH_KEYWORDS = ['ai', 'apple', 'google', 'microsoft', 'smartphone', 'gadget', 'software', 'hardware', 'app', 'launch'];

function getCategory(title, content, defaultCat) {
  const text = (title + ' ' + content).toLowerCase();
  let cyberCount = CYBER_KEYWORDS.filter(k => text.includes(k)).length;
  let techCount = TECH_KEYWORDS.filter(k => text.includes(k)).length;
  
  if (cyberCount > techCount && cyberCount > 0) return 'Cybersecurity';
  if (techCount > cyberCount && techCount > 0) return 'Tech';
  return defaultCat;
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

async function fetchNews() {
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  const existingFiles = fs.readdirSync(postsDir);
  const existingSlugs = new Set(existingFiles.map(f => f.replace('.json', '')));

  let allPosts = [];

  for (const feed of FEEDS) {
    try {
      console.log(`Fetching ${feed.url}...`);
      const feedData = await parser.parseURL(feed.url);
      
      for (const item of feedData.items) {
        const title = item.title;
        if (!title) continue;
        
        const slug = generateSlug(title);
        
        if (existingSlugs.has(slug)) continue;

        const content = item.contentSnippet || item.content || '';
        if (content.length < 50) continue; // Filter out very short/useless content

        const category = getCategory(title, content, feed.category);
        const date = new Date(item.pubDate || item.isoDate || Date.now());
        
        // Simple "rewriting" logic for Tier-1 audience
        const summary = item.contentSnippet || item.content || 'No summary available.';
        const cleanSummary = summary.split('\n')[0].substring(0, 300) + '...';

        const post = {
          title,
          slug,
          date: date.toISOString(),
          description: item.contentSnippet?.substring(0, 160) || title,
          category,
          content: {
            summary: cleanSummary,
            impact: `This development in ${category.toLowerCase()} highlights the evolving landscape of technology. For users in the US, UK, Canada, and Australia, staying informed about these changes is crucial for digital safety and productivity.`,
            takeaways: [
              `Stay updated with the latest ${category} trends.`,
              `Ensure your systems are patched and secure.`,
              `Follow Newsera.blog for more updates.`
            ]
          },
          link: item.link,
          author: item.creator || 'Newsera Team'
        };

        allPosts.push(post);
      }
    } catch (error) {
      console.error(`Error fetching ${feed.url}:`, error.message);
    }
  }

  // Sort by date to get the freshest news across all feeds
  allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

  console.log(`Found ${allPosts.length} new posts.`);
  
  // Limit to 3 new posts per run to match the "3 posts per day" goal
  // We take the top 3 freshest ones that aren't already saved
  const postsToSave = allPosts.slice(0, 3);

  for (const post of postsToSave) {
    const filePath = path.join(postsDir, `${post.slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(post, null, 2));
    console.log(`Saved: ${post.slug}`);
  }
}

fetchNews();
