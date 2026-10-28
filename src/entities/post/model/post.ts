import type { MDXContent } from 'mdx/types';
import { z } from 'zod';
import type { TocItem } from '../api/toc';

export { ContentError } from '@/shared/lib/content-error';

export const postFrontmatterSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  lead: z.string().min(1),
  date: z.iso.date().optional(),
  readingMinutes: z.number().int().positive(),
  source: z.literal('Medium').optional(),
  canonicalUrl: z.url().optional(),
  relatedProject: z.string().optional(),
  draft: z.boolean().default(false),
});

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;

export type Post = PostFrontmatter & { slug: string };

export interface LoadedPost {
  /** The compiled MDX body. */
  Content: MDXContent;
  tableOfContents: TocItem[];
}
