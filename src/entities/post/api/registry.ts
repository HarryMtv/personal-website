import type { MDXContent } from 'mdx/types';
import { ContentError } from '@/shared/lib/content-error';
import { postFrontmatterSchema, type LoadedPost, type Post } from '../model/post';
import type { TocItem } from './toc';

/**
 * The writing content pipeline: content/writing/*.mdx → zod → this registry.
 * Drafts are held back from every listing but stay reachable for previews.
 */
const frontmatterModules = import.meta.glob<{ frontmatter: unknown }>('/content/writing/*.mdx', {
  eager: true,
  import: 'frontmatter',
});
const bodyModules = import.meta.glob<{ default: MDXContent; tableOfContents: TocItem[] }>(
  '/content/writing/*.mdx',
);

function slugFromPath(path: string): string {
  return path
    .split('/')
    .pop()!
    .replace(/\.mdx$/, '');
}

export const posts: Post[] = Object.entries(frontmatterModules)
  .map(([path, frontmatter]) => {
    const parsed = postFrontmatterSchema.safeParse(frontmatter);
    if (!parsed.success) {
      throw new ContentError(path, parsed.error);
    }
    return { ...parsed.data, slug: slugFromPath(path) };
  })
  // Newest first; undated drafts of the future sort last.
  .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

export function getPosts(): Post[] {
  return posts.filter((post) => !post.draft);
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export async function loadPost(slug: string): Promise<LoadedPost> {
  const loader = bodyModules[`/content/writing/${slug}.mdx`];
  if (!loader) {
    throw new Error(`No content for post "${slug}"`);
  }
  const module = await loader();
  return { Content: module.default, tableOfContents: module.tableOfContents ?? [] };
}
