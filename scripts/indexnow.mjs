// Notifies Bing (and other IndexNow engines) about new or updated URLs.
// Usage: node scripts/indexnow.mjs [--hours=48] [--all] [--dry-run]
import fs from 'node:fs';
import path from 'node:path';

const KEY = '9aa4cfa63f2247cd86e84ee6bc16f0ff';
const HOST = 'newsera.blog';
const SITE = `https://${HOST}`;
const CATEGORY_PATHS = {
  Tech: 'tech',
  Cybersecurity: 'cybersecurity',
  'Sports News': 'sports',
  'Business / Economic News': 'business',
  'Political News': 'politics',
  'Science & Technology News': 'science',
};

const args = process.argv.slice(2);
const all = args.includes('--all');
const dry = args.includes('--dry-run');
const hours = Number((args.find((a) => a.startsWith('--hours=')) || '--hours=48').split('=')[1]);
const cutoff = Date.now() - hours * 3600 * 1000;

const dir = path.join(process.cwd(), 'content', 'posts');
const urls = new Set([`${SITE}/`, ...Object.values(CATEGORY_PATHS).map((p) => `${SITE}/${p}`)]);
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const post = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  if (all || new Date(post.date).getTime() >= cutoff) {
    urls.add(`${SITE}/${CATEGORY_PATHS[post.category] ?? 'tech'}/${post.slug}`);
  }
}

const urlList = [...urls].slice(0, 10000);
console.log(`${urlList.length} URLs${dry ? ' (dry run)' : ''}`);
if (dry) process.exit(0);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow responded ${res.status} ${res.statusText}`);
if (!res.ok && res.status !== 202) process.exit(1);
