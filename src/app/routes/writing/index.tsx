import { createFileRoute } from '@tanstack/react-router';
import { WritingPage } from '@/pages/writing';
import { pageTitle } from '@/shared/config/site';

const head = () => ({
  meta: [
    { title: pageTitle('writing/') },
    { name: 'description', content: 'Build logs and articles.' },
  ],
});

export const Route = createFileRoute('/writing/')({
  head,
  component: WritingPage,
});
