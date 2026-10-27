import { getRouteApi } from '@tanstack/react-router';
import { getProjects } from '@/entities/project';
import { filterProjects, resolveSelected } from '@/features/filter-projects';
import { ProjectExplorer } from '@/widgets/project-explorer';
import { Window } from '@/shared/ui/window';

const route = getRouteApi('/projects/');

/** The projects/ window: the file explorer over content/projects. */
export function ProjectsPage() {
  const search = route.useSearch();
  const filtered = filterProjects(getProjects(), search);
  const selected = resolveSelected(filtered, search.selected);

  return (
    <Window
      path={[{ label: 'projects/' }]}
      meta={`${filtered.length} items`}
      closeTo="/desktop"
      maxWidth="xl"
    >
      <ProjectExplorer projects={filtered} search={search} selected={selected} />
    </Window>
  );
}
