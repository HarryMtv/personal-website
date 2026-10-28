import { describe, expect, it } from 'vitest';
import { getProjects } from '@/entities/project';
import { filterProjects, resolveSelected } from './filter-projects';

const projects = getProjects();

describe('filterProjects', () => {
  it('returns everything for kind all without a tag', () => {
    expect(filterProjects(projects, { kind: 'all' })).toHaveLength(7);
  });

  it('filters by kind', () => {
    const side = filterProjects(projects, { kind: 'side' });
    expect(side.map((project) => project.slug)).toEqual([
      'pm-telegram-hub',
      'telegram-content-engine',
      'create-frontstack',
    ]);
    const work = filterProjects(projects, { kind: 'work' });
    expect(work.map((project) => project.slug)).toEqual([
      'table-view',
      'host-app',
      'qa-automation-engine',
    ]);
  });

  it('filters by tag', () => {
    const threeD = filterProjects(projects, { kind: 'all', tag: '3d' });
    expect(threeD.map((project) => project.slug)).toEqual(['splat-tours']);
  });

  it('combines kind and tag with AND', () => {
    expect(filterProjects(projects, { kind: 'experiment', tag: 'telegram' })).toEqual([]);
    expect(filterProjects(projects, { kind: 'side', tag: 'ai' })).toHaveLength(3);
  });
});

describe('resolveSelected', () => {
  it('picks the matching project', () => {
    expect(resolveSelected(projects, 'telegram-content-engine')?.slug).toBe(
      'telegram-content-engine',
    );
  });

  it('falls back to the first filtered project', () => {
    expect(resolveSelected(projects, 'unknown')?.slug).toBe('pm-telegram-hub');
    expect(resolveSelected(projects, undefined)?.slug).toBe('pm-telegram-hub');
  });

  it('returns undefined for an empty list', () => {
    expect(resolveSelected([], 'x')).toBeUndefined();
  });
});
