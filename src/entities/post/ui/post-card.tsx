import { Link } from '@tanstack/react-router';
import { formatDate } from '@/shared/lib/format-date';
import type { Post } from '../model/post';

/** A writing/ index card linking to the post. */
export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      to="/writing/$slug"
      params={{ slug: post.slug }}
      className="rounded-card border-ink/15 bg-card text-ink hover:border-accent flex flex-col gap-2 border p-[22px] no-underline"
    >
      <span className="text-muted font-mono text-xs font-medium">
        {[post.source, formatDate(post.date)].filter(Boolean).join(' · ')}
      </span>
      <span className="font-display text-ink text-2xl/[1.2] font-bold">{post.title}</span>
      <span className="text-ink-2 text-[15px]/[1.55]">{post.summary}</span>
      <span className="text-accent text-[15px] font-semibold">Read post →</span>
    </Link>
  );
}
