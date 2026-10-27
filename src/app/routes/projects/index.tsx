import { createFileRoute } from '@tanstack/react-router';
import { ProjectsPage } from '@/pages/projects';
import { projectExplorerSearchSchema } from '@/features/filter-projects';
import { pageTitle } from '@/shared/config/site';

const head = () => ({
  meta: [
    { title: pageTitle('projects/') },
    { name: 'description', content: 'Side projects, work highlights and experiments.' },
  ],
});

export const Route = createFileRoute('/projects/')({
  validateSearch: (search) => projectExplorerSearchSchema.parse(search),
  head,
  component: ProjectsPage,
});
