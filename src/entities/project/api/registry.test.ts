import { describe, expect, it } from 'vitest';
import { getProjectBySlug, getProjects, loadCaseStudy } from './registry';

describe('project registry', () => {
  it('parses every content file', () => {
    // Registry construction throws ContentError on any invalid frontmatter.
    expect(getProjects()).toHaveLength(7);
  });

  it('derives unique slugs from filenames and sorts by order', () => {
    const projects = getProjects();
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(projects.map((project) => project.order)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(projects[0].slug).toBe('pm-telegram-hub');
    expect(projects.at(-1)?.slug).toBe('create-frontstack');
  });

  it('finds projects by slug and returns undefined for unknown ones', () => {
    expect(getProjectBySlug('pm-telegram-hub')?.title).toBe('PM Telegram Hub');
    expect(getProjectBySlug('create-frontstack')?.kind).toBe('side');
    expect(getProjectBySlug('nope')).toBeUndefined();
  });

  it('marks the projects that have a case study', () => {
    expect(
      getProjects()
        .filter((project) => project.hasCaseStudy)
        .map((project) => project.slug),
    ).toEqual([
      'pm-telegram-hub',
      'telegram-content-engine',
      'table-view',
      'host-app',
      'qa-automation-engine',
      'create-frontstack',
    ]);
  });

  it('throws when loading an unknown case study slug', async () => {
    await expect(loadCaseStudy('missing-project')).rejects.toThrow(
      /No case study content for "missing-project"/,
    );
  });
});
