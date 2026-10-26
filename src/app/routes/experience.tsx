import { createFileRoute } from '@tanstack/react-router';
import { ExperiencePage } from '@/pages/experience';
import { pageTitle } from '@/shared/config/site';

const head = () => ({
  meta: [
    { title: pageTitle('experience.md') },
    {
      name: 'description',
      content: '10+ years across Wrike, Citrix and Motorola Solutions — the CV timeline.',
    },
  ],
});

export const Route = createFileRoute('/experience')({
  head,
  component: ExperiencePage,
});
