import { createFileRoute } from '@tanstack/react-router';
import { NowPage } from '@/pages/now';
import { pageTitle } from '@/shared/config/site';

const head = () => ({
  meta: [
    { title: pageTitle('now.md') },
    { name: 'description', content: 'What Igor is focused on right now.' },
  ],
});

export const Route = createFileRoute('/now')({
  head,
  component: NowPage,
});
