import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Post } from '@/lib/posts';
import { Shield, Cpu, Trophy, Briefcase, Landmark, FlaskConical, Calendar, User } from 'lucide-react';
import { categoryPath } from '@/lib/categories';
import { getMetaDescription } from '@/lib/key-points';

export default function PostCard({ post, index = 99 }: { post: Post; index?: number }) {
  const icons: Record<string, typeof Cpu> = {
    Cybersecurity: Shield,
    'Sports News': Trophy,
    'Business / Economic News': Briefcase,
    'Political News': Landmark,
    'Science & Technology News': FlaskConical,
  };
  const Icon = icons[post.category] ?? Cpu;
  const previewText = getMetaDescription(post, 160);
  return (
    <article className="group relative flex flex-col space-y-3 border rounded-xl overflow-hidden hover:shadow-lg focus-within:ring-2 focus-within:ring-primary transition-all bg-card">
      <div className="aspect-video w-full bg-muted relative flex items-center justify-center overflow-hidden">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            {...(index === 0 ? { priority: true } : { loading: index < 3 ? ("eager" as const) : ("lazy" as const) })}
            referrerPolicy="no-referrer"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-105 transition-transform duration-500" />
            <Icon size={48} className="text-primary/40 relative z-10" />
          </>
        )}
      </div>
      <div className="p-4 pt-0 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-widest">
          <Icon size={12} />
          {post.category}
        </div>
        <Link href={`/${categoryPath(post.category)}/${post.slug}`} className="after:absolute after:inset-0 focus:outline-none">
          <h2 className="text-xl font-bold group-hover:text-primary transition-colors leading-tight line-clamp-2">
            {post.title}
          </h2>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {previewText}
        </p>
        <div className="flex items-center gap-4 pt-3 text-xs text-muted-foreground border-t">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {format(new Date(post.date), 'MMM dd, yyyy')}
          </span>
          <span className="flex items-center gap-1">
            <User size={12} />
            {post.author}
          </span>
        </div>
      </div>
    </article>
  );
}
