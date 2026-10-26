import { z } from 'zod';

export const PROJECT_KINDS = ['side', 'work', 'experiment'] as const;
export type ProjectKind = (typeof PROJECT_KINDS)[number];

export const PROJECT_TAGS = ['typescript', 'telegram', 'ai', '3d'] as const;
export type ProjectTag = (typeof PROJECT_TAGS)[number];

/** Sidebar labels for the kinds; the URL uses the raw kind value. */
export const PROJECT_KIND_LABELS: Record<'all' | ProjectKind, string> = {
  all: 'All projects',
  side: 'Side projects',
  work: 'Work',
  experiment: 'Experiments',
};

/** Tag filter meta: label + the coloured dot from the mock. */
export const PROJECT_TAG_META: Record<ProjectTag, { label: string; color: string }> = {
  typescript: { label: 'TypeScript', color: '#2944C9' },
  telegram: { label: 'Telegram', color: '#E8A93A' },
  ai: { label: 'AI', color: '#A94B27' },
  '3d': { label: '3D', color: '#1F7A5A' },
};

export const projectFrontmatterSchema = z.object({
  title: z.string().min(1),
  kind: z.enum(PROJECT_KINDS),
  kindLabel: z.string().min(1),
  tags: z.array(z.enum(PROJECT_TAGS)),
  summary: z.string().min(1),
  lead: z.string().optional(),
  stack: z.array(z.string().min(1)),
  stackShort: z.string().min(1),
  role: z.string().min(1),
  status: z.string().optional(),
  facts: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
  screenshotCaption: z.string(),
  order: z.number().int().nonnegative(),
  hasCaseStudy: z.boolean(),
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;

export type Project = ProjectFrontmatter & { slug: string };

/** Error naming the offending content file, thrown by the registry. */
export class ContentError extends Error {
  constructor(
    public readonly file: string,
    cause: z.ZodError,
  ) {
    super(`Invalid frontmatter in ${file}: ${cause.message}`, { cause });
    this.name = 'ContentError';
  }
}
