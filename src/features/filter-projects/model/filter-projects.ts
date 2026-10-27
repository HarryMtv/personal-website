import type { Project, ProjectKind, ProjectTag } from '@/entities/project';

export interface ProjectFilters {
  /** Absent means "all". */
  kind?: 'all' | ProjectKind;
  tag?: ProjectTag;
}

/** Pure filter: kind and tag combine with AND. */
export function filterProjects(projects: Project[], { kind, tag }: ProjectFilters): Project[] {
  return projects.filter((project) => {
    if (kind && kind !== 'all' && project.kind !== kind) return false;
    if (tag && !project.tags.includes(tag)) return false;
    return true;
  });
}

/** The selected project if it survived the filters, else the first one. */
export function resolveSelected(
  filtered: Project[],
  selected: string | undefined,
): Project | undefined {
  return filtered.find((project) => project.slug === selected) ?? filtered[0];
}
