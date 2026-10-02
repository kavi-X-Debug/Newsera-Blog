// Adds AI-written key points to posts that do not have them yet, newest first.
// Usage: node scripts/summarize-posts.mjs [--limit=50] [--delay=6500] [--dir=content/posts] [--dry-run]
import fs from 'node:fs';
import path from 'node:path';
import { summarize, QuotaError, AuthError } from './lib/gemini-summary.mjs';

const arg = (name, fallback) => {
  const hit = process.argv.slice(2).find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=')[1] : fallback;
};
const limit = Number(arg('limit', 50));
const delay = Number(arg('delay', 6500)); // ~9 requests/minute keeps within free-tier limits
const dir = path.resolve(arg('dir', 'content/posts'));
const dry = process.argv.includes('--dry-run');
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey && !dry) {
  console.log('GEMINI_API_KEY is not set; skipping summaries.');
  process.exit(0);
}

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
const posts = files.map((f) => ({ file: path.join(dir, f), post: JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) }));
posts.sort((a, b) => (a.post.date < b.post.date ? 1 : -1));
const todo = posts.filter(({ post }) => !post.content?.keyPointsBy);

console.log(`${posts.length} posts, ${todo.length} without AI key points, processing up to ${limit}${dry ? ' (dry run)' : ''}.`);
if (dry) process.exit(0);

let done = 0, rejected = 0, failed = 0;
for (const { file, post } of todo.slice(0, limit)) {
  try {
    const points = await summarize({ title: post.title, text: post.content?.summary || post.description, apiKey });
    post.content = { ...post.content, keyPoints: points ?? [], keyPointsBy: points ? 'gemini' : 'gemini-rejected' };
    fs.writeFileSync(file, JSON.stringify(post, null, 2));
    points ? done++ : rejected++;
  } catch (err) {
    if (err instanceof QuotaError) { console.log(`Stopped: ${err.message}. Remaining posts will be done on the next run.`); break; }
    if (err instanceof AuthError) { console.error(`Stopped: ${err.message}`); process.exitCode = 1; break; }
    failed++;
    console.error(`Skipped "${post.slug}": ${err.message}`);
  }
  if (delay > 0) await new Promise((r) => setTimeout(r, delay));
}
console.log(`Summaries written: ${done}, rejected by safety checks: ${rejected}, errors: ${failed}.`);
