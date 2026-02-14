import Link from 'next/link';
import { format } from 'date-fns';
import { Post } from '@/lib/posts';
import { Shield, Cpu, Calendar, User } from 'lucide-react';

export default function PostCard({ post }: { post: Post }) {
  const Icon = post.category === 'Cybersecurity' ? Shield : Cpu;

  return (
    <article className="group flex flex-col space-y-3 border rounded-xl overflow-hidden hover:shadow-lg transition-all bg-card">
      <div className="aspect-video w-full bg-muted relative flex items-center justify-center overflow-hidden">
        {post.image ? (
          <img 
            src={post.image} 
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
        <Link href={`/post/${post.slug}`}>
          <h2 className="text-xl font-bold group-hover:text-primary transition-colors leading-tight line-clamp-2">
            {post.title}
          </h2>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {post.description}
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
