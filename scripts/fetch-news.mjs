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
const SPORTS_KEYWORDS = ['sport', 'game', 'match', 'tournament', 'league', 'cup', 'goal', 'score', 'player', 'coach', 'team', 'nba', 'nfl', 'mlb', 'premier league', 'fifa', 'olympic'];
const BUSINESS_KEYWORDS = ['business', 'market', 'stock', 'stocks', 'shares', 'ipo', 'earnings', 'revenue', 'profit', 'loss', 'funding', 'merger', 'acquisition', 'economy', 'economic', 'inflation', 'gdp', 'forex', 'trade'];
const POLITICS_KEYWORDS = ['election', 'policy', 'government', 'senate', 'congress', 'parliament', 'minister', 'president', 'prime minister', 'law', 'bill', 'regulation', 'sanction', 'diplomatic', 'geopolitics'];
const SCI_TECH_KEYWORDS = ['science', 'research', 'study', 'space', 'nasa', 'astronomy', 'physics', 'chemistry', 'biology', 'genetics', 'lab', 'experiment', 'technology', 'tech'];

function getCategory(title, content, defaultCat) {
  const text = (title + ' ' + content).toLowerCase();
  const counts = {
    'Cybersecurity': CYBER_KEYWORDS.filter(k => text.includes(k)).length,
    'Tech': TECH_KEYWORDS.filter(k => text.includes(k)).length,
    'Sports News': SPORTS_KEYWORDS.filter(k => text.includes(k)).length,
    'Business / Economic News': BUSINESS_KEYWORDS.filter(k => text.includes(k)).length,
    'Political News': POLITICS_KEYWORDS.filter(k => text.includes(k)).length,
    'Science & Technology News': SCI_TECH_KEYWORDS.filter(k => text.includes(k)).length,
  };
  let best = { cat: defaultCat, score: 0 };
  for (const [cat, score] of Object.entries(counts)) {
    if (score > best.score) best = { cat, score };
  }
  return best.score > 0 ? best.cat : defaultCat;
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

function extractImage(item) {
  // 1. Try enclosure
  if (item.enclosure && item.enclosure.url && item.enclosure.type?.startsWith('image/')) {
    return item.enclosure.url;
  }
  // 2. Try media:content (often in 'media:content' or item['media:content'])
  const mediaContent = item['media:content'] || item.mediaContent;
  if (mediaContent && mediaContent.$ && mediaContent.$.url) {
    return mediaContent.$.url;
  }
  if (Array.isArray(mediaContent) && mediaContent[0] && mediaContent[0].$ && mediaContent[0].$.url) {
    return mediaContent[0].$.url;
  }
  // 3. Try parsing from content/summary
  const content = item.content || item.contentSnippet || '';
  
  // Try to find image in media:group or similar structures
  if (item['media:group'] && item['media:group']['media:content']) {
    const groupMedia = item['media:group']['media:content'];
    if (Array.isArray(groupMedia) && groupMedia[0] && groupMedia[0].$ && groupMedia[0].$.url) {
      return groupMedia[0].$.url;
    }
  }

  // 4. Try parsing all tags for any URL that looks like an image
  for (const key in item) {
    if (typeof item[key] === 'string' && item[key].match(/\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i)) {
      if (item[key].startsWith('http')) return item[key];
    }
  }

  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1];
  }
  return null;
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
        const imageUrl = extractImage(item);
        
        // Improved content extraction for a richer post
        const fullContent = item.content || item.contentSnippet || '';
        const cleanSummary = fullContent
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/\s+/g, ' ')    // Normalize whitespace
          .trim()
          .substring(0, 1000) + '...';

        const post = {
          title,
          slug,
          date: date.toISOString(),
          description: item.contentSnippet?.substring(0, 160).replace(/\s+/g, ' ').trim() || title,
          category,
          image: imageUrl,
          content: {
            summary: cleanSummary,
            impact: `The implications of this ${category.toLowerCase()} update are significant for digital infrastructure in Tier-1 nations. Experts suggest that such developments could influence both consumer behavior and enterprise-level security protocols in the US, UK, CA, and AU markets.`,
            takeaways: [
              `Analyze how this ${category} shift affects your current digital setup.`,
              `Stay proactive by implementing recommended security patches or software updates.`,
              `Monitor News Era for further developments on this story.`
            ]
          },
          link: item.link,
          author: item.creator || 'News Era Team'
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
