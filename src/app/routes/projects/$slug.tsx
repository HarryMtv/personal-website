import { createFileRoute, notFound } from '@tanstack/react-router';
import { ProjectCaseStudyPage } from '@/pages/project-case-study';
import { getProjectBySlug, loadCaseStudy } from '@/entities/project';
import { pageTitle } from '@/shared/config/site';

export const Route = createFileRoute('/projects/$slug')({
  loader: async ({ params }) => {
    const project = getProjectBySlug(params.slug);
    if (!project?.hasCaseStudy) throw notFound(); // eslint-disable-line @typescript-eslint/only-throw-error -- TanStack's notFound() marker
    return { project, Content: await loadCaseStudy(project.slug) };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: pageTitle(loaderData.project.title) },
            {
              name: 'description',
              content: loaderData.project.summary,
            },
          ],
        }
      : { meta: [] },
  component: ProjectCaseStudyPage,
});
