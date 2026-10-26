import type { MDXContent } from 'mdx/types';
import { ContentError, projectFrontmatterSchema, type Project } from '../model/project';

/**
 * The content pipeline: content/projects/*.mdx → remark frontmatter →
 * import.meta.glob → zod → this registry. Only entity api segments may
 * touch content/ (enforced by dependency-cruiser).
 */

// Eager frontmatter for the explorer; lazy default exports for case studies.
const frontmatterModules = import.meta.glob<{ frontmatter: unknown }>('/content/projects/*.mdx', {
  eager: true,
  import: 'frontmatter',
});
const bodyModules = import.meta.glob<{ default: MDXContent }>('/content/projects/*.mdx');

function slugFromPath(path: string): string {
  return path
    .split('/')
    .pop()!
    .replace(/\.mdx$/, '');
}

export const projects: Project[] = Object.entries(frontmatterModules)
  .map(([path, frontmatter]) => {
    const parsed = projectFrontmatterSchema.safeParse(frontmatter);
    if (!parsed.success) {
      throw new ContentError(path, parsed.error);
    }
    return { ...parsed.data, slug: slugFromPath(path) };
  })
  .sort((a, b) => a.order - b.order);

export function getProjects(): Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export async function loadCaseStudy(slug: string): Promise<MDXContent> {
  const loader = bodyModules[`/content/projects/${slug}.mdx`];
  if (!loader) {
    throw new Error(`No case study content for "${slug}"`);
  }
  const module = await loader();
  return module.default;
}
