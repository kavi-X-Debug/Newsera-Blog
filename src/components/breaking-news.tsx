import Link from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';
import { Zap, ArrowRight, Clock } from 'lucide-react';
import type { Post } from '@/lib/posts';
import { categoryPath } from '@/lib/categories';
import { BREAKING_WINDOW_MS, BREAKING_WINDOW_HOURS } from '@/lib/breaking-window';

const hrefFor = (p: Post) => `/${categoryPath(p.category)}/${p.slug}`;

function freshness(p: Post) {
  const published = Date.parse(p.date);
  const left = published + BREAKING_WINDOW_MS - Date.now();
  return {
    ago: `${formatDistanceToNowStrict(published)} ago`,
    hoursLeft: left > 0 ? Math.max(1, Math.ceil(left / 3_600_000)) : 0,
    pct: Math.min(100, Math.max(0, (left / BREAKING_WINDOW_MS) * 100)),
  };
}

function Card({ post, size, flagged }: { post: Post; size: 'lead' | 'small'; flagged: boolean }) {
  const f = freshness(post);
  const lead = size === 'lead';

  return (
    <article
      className={`group relative isolate overflow-hidden rounded-2xl bg-slate-800 shadow-lg ring-1 ring-white/10 transition-shadow hover:shadow-2xl focus-within:ring-2 focus-within:ring-sky-300 ${
        lead ? 'min-h-[22rem] lg:col-span-2 lg:min-h-[28rem]' : 'min-h-[13rem] lg:min-h-0 lg:flex-1'
      } h-full`}
    >
      {post.image ? (
        <img
          src={post.image}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900" />
      )}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />

      <div className="flex h-full flex-col justify-between p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          {flagged && (
            <span className="rounded bg-red-700 px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest text-white">Breaking alert</span>
          )}
          <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur">
            {post.category}
          </span>
          {f.hoursLeft > 0 && (
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[11px] font-medium text-amber-200 backdrop-blur">
              <Clock size={11} aria-hidden="true" /> {f.hoursLeft}h left
            </span>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-sky-200">{f.ago}</p>
          <h3 className={`font-extrabold leading-tight text-white ${lead ? 'text-2xl sm:text-3xl' : 'text-lg'}`}>
            <Link
              href={hrefFor(post)}
              className="line-clamp-4 after:absolute after:inset-0 after:content-[''] focus:outline-none"
            >
              {post.title}
            </Link>
          </h3>
          {lead && (
            <p className="inline-flex items-center gap-1 text-sm font-semibold text-sky-200 transition-all group-hover:gap-2">
              Read the story <ArrowRight size={14} aria-hidden="true" />
            </p>
          )}
        </div>
      </div>

      {f.hoursLeft > 0 && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/15">
          <div className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-amber-300" style={{ width: `${f.pct}%` }} />
          <span className="sr-only">
            Stays in Breaking News for about {f.hoursLeft} more {f.hoursLeft === 1 ? 'hour' : 'hours'}.
          </span>
        </div>
      )}
    </article>
  );
}

export default function BreakingNews({ posts, isBreaking }: { posts: Post[]; isBreaking: boolean }) {
  if (posts.length === 0) return null;
  const [lead, ...rest] = posts;

  return (
    <section aria-labelledby="breaking-heading" className="breaking-border rounded-[1.65rem] p-[3px] shadow-2xl">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 text-white md:p-7">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-red-500/15 blur-3xl" />

        <header className="relative mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-white shadow-lg shadow-red-900/40">
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
            </span>
            Just in
          </span>
          <h2 id="breaking-heading" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight md:text-3xl">
            <Zap size={24} className="text-amber-400" aria-hidden="true" />
            Breaking News
          </h2>
          <p className="text-sm text-slate-300">
            {posts.length} {posts.length === 1 ? 'story' : 'stories'} from the last {BREAKING_WINDOW_HOURS} hours
          </p>
          <Link
            href="/breaking"
            className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            See all <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </header>

        <div className="relative lg:grid lg:grid-cols-3 lg:gap-5">
          <ul
            className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:thin] md:-mx-7 md:px-7 lg:contents lg:overflow-visible lg:p-0"
            aria-label="Breaking stories"
          >
            <li className="w-[85%] shrink-0 snap-center sm:w-[60%] lg:col-span-2 lg:w-auto">
              <Card post={lead} size="lead" flagged={isBreaking} />
            </li>
            {rest.length > 0 && (
              <li className="contents lg:flex lg:flex-col lg:gap-5">
                {rest.map((p) => (
                  <div key={p.slug} className="w-[85%] shrink-0 snap-center sm:w-[60%] lg:w-auto lg:flex-1">
                    <Card post={p} size="small" flagged={false} />
                  </div>
                ))}
              </li>
            )}
          </ul>
          {rest.length > 0 && (
            <p className="mt-1 flex items-center justify-center gap-1 text-xs text-slate-400 lg:hidden" aria-hidden="true">
              Swipe for more <ArrowRight size={12} />
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
