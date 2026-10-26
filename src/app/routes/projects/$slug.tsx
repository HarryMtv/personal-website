import { createFileRoute } from '@tanstack/react-router';
import { ProjectCaseStudyPage } from '@/pages/project-case-study';

export const Route = createFileRoute('/projects/$slug')({
  component: ProjectCaseStudyPage,
});
