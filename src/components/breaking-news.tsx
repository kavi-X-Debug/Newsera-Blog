import Link from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';
import { ArrowRight, Clock } from 'lucide-react';
import type { Post } from '@/lib/posts';
import { categoryPath } from '@/lib/categories';
import { BREAKING_WINDOW_MS, BREAKING_WINDOW_HOURS } from '@/lib/breaking-window';

const hrefFor = (p: Post) => `/${categoryPath(p.category)}/${p.slug}`;

function meta(p: Post) {
  const published = Date.parse(p.date);
  const left = published + BREAKING_WINDOW_MS - Date.now();
  return {
    ago: `${formatDistanceToNowStrict(published)} ago`,
    hoursLeft: left > 0 ? Math.max(1, Math.ceil(left / 3_600_000)) : 0,
  };
}

function Meta({ post }: { post: Post }) {
  const m = meta(post);
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
      <time dateTime={post.date}>{m.ago}</time>
      {m.hoursLeft > 0 && (
        <span className="inline-flex items-center gap-1">
          <Clock size={12} aria-hidden="true" />
          Stays here {m.hoursLeft}h more
        </span>
      )}
    </p>
  );
}

function Image({ post, className }: { post: Post; className: string }) {
  return post.image ? (
    <img
      src={post.image}
      alt=""
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className={className}
    />
  ) : (
    <div className={`${className} bg-gradient-to-br from-slate-700 to-slate-800`} />
  );
}

const dek = (p: Post) => (p.description?.trim() || p.content?.summary?.slice(0, 160) || '').trim();

export default function BreakingNews({ posts, isBreaking }: { posts: Post[]; isBreaking: boolean }) {
  if (posts.length === 0) return null;
  const [lead, ...rest] = posts;

  return (
    <section
      aria-labelledby="breaking-heading"
      className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-slate-100 shadow-lg"
    >
      <div aria-hidden="true" className="h-1 bg-red-600" />

      <div className="p-5 md:p-8">
        <header className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-slate-800 pb-4">
          <h2 id="breaking-heading" className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.18em] text-white">
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            Breaking News
          </h2>
          <p className="text-sm text-slate-400">
            {posts.length} {posts.length === 1 ? 'story' : 'stories'} in the last {BREAKING_WINDOW_HOURS} hours
          </p>
          <Link
            href="/breaking"
            className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-slate-200 underline-offset-4 hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            View all <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </header>

        <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
          <article className="group relative lg:col-span-3">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-800">
              <Image
                post={lead}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.02]"
              />
            </div>
            <div className="mt-4 space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-red-400">
                {isBreaking && <span>Breaking alert · </span>}
                <span className={isBreaking ? 'text-slate-300' : ''}>{lead.category}</span>
              </p>
              <h3 className="text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl">
                <Link
                  href={hrefFor(lead)}
                  className="decoration-2 underline-offset-4 after:absolute after:inset-0 after:content-[''] group-hover:underline focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-sky-400"
                >
                  {lead.title}
                </Link>
              </h3>
              {dek(lead) && <p className="line-clamp-2 text-base leading-relaxed text-slate-300">{dek(lead)}</p>}
              <Meta post={lead} />
            </div>
          </article>

          {rest.length > 0 && (
            <ul className="divide-y divide-slate-800 self-start lg:col-span-2" aria-label="More breaking stories">
              {rest.map((p) => (
                <li key={p.slug} className="group relative flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-red-400">{p.category}</p>
                    <h3 className="text-base font-semibold leading-snug text-white">
                      <Link
                        href={hrefFor(p)}
                        className="line-clamp-3 decoration-1 underline-offset-4 after:absolute after:inset-0 after:content-[''] group-hover:underline focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-sky-400"
                      >
                        {p.title}
                      </Link>
                    </h3>
                    <Meta post={p} />
                  </div>
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md bg-slate-800">
                    <Image post={p} className="h-full w-full object-cover" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
