import Link from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';
import { Zap, ArrowRight } from 'lucide-react';
import type { Post } from '@/lib/posts';
import { categoryPath } from '@/lib/categories';

const hrefFor = (p: Post) => `/${categoryPath(p.category)}/${p.slug}`;
const ago = (p: Post) => `${formatDistanceToNowStrict(new Date(p.date))} ago`;

function Thumb({ post, className }: { post: Post; className: string }) {
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
    <div className={`${className} bg-gradient-to-br from-blue-700 to-slate-800`} />
  );
}

export default function BreakingNews({ posts, isBreaking }: { posts: Post[]; isBreaking: boolean }) {
  if (posts.length === 0) return null;
  const [lead, ...rest] = posts;
  const dot = isBreaking ? 'bg-red-500' : 'bg-sky-400';

  return (
    <section
      aria-labelledby="breaking-heading"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-5 text-white shadow-xl ring-1 ring-white/10 md:p-8"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />

      <header className="relative mb-5 flex flex-wrap items-center gap-3">
        <span className={`inline-flex items-center gap-2 rounded px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-white ${isBreaking ? 'bg-red-700' : 'bg-blue-700'}`}>
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 motion-safe:animate-ping ${dot}`} />
            <span className={`relative inline-flex h-2 w-2 rounded-full ${dot}`} />
          </span>
          {isBreaking ? 'Breaking' : 'Just in'}
        </span>
        <h2 id="breaking-heading" className="flex items-center gap-2 text-xl font-bold tracking-tight md:text-2xl">
          <Zap size={20} className="text-amber-400" aria-hidden="true" />
          {isBreaking ? 'Breaking News' : 'Latest Developments'}
        </h2>
        <span className="text-xs text-slate-300">Stories from the last 24 hours</span>
      </header>

      <div className="relative grid gap-5 lg:grid-cols-3">
        <article className="group relative overflow-hidden rounded-xl ring-1 ring-white/10 lg:col-span-2">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-800 sm:aspect-video">
            <Thumb post={lead} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 space-y-2 p-4 md:p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-300">
                {lead.category} <span className="text-slate-300">· {ago(lead)}</span>
              </p>
              <h3 className="text-xl font-extrabold leading-tight sm:text-2xl md:text-3xl">
                <Link href={hrefFor(lead)} className="after:absolute after:inset-0 focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-sky-300">
                  {lead.title}
                </Link>
              </h3>
              <p className="inline-flex items-center gap-1 text-sm font-medium text-sky-200 transition-all group-hover:gap-2">
                Read the story <ArrowRight size={14} aria-hidden="true" />
              </p>
            </div>
          </div>
        </article>

        {rest.length > 0 && (
          <ul className="flex flex-col gap-3">
            {rest.map((p) => (
              <li key={p.slug} className="group relative flex gap-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/10 transition-colors hover:bg-white/10">
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                  <Thumb post={p} className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-110" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-sky-300">
                    {p.category} <span className="text-slate-300">· {ago(p)}</span>
                  </p>
                  <h3 className="mt-1 line-clamp-3 text-sm font-semibold leading-snug">
                    <Link href={hrefFor(p)} className="after:absolute after:inset-0 focus:outline-none focus-visible:after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-sky-300">
                      {p.title}
                    </Link>
                  </h3>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
