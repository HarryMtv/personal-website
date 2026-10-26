import { createFileRoute } from '@tanstack/react-router';
import { StackPage } from '@/pages/stack';
import { pageTitle } from '@/shared/config/site';

const head = () => ({
  meta: [
    { title: pageTitle('uses.md') },
    { name: 'description', content: 'The daily stack, tooling, testing and AI workflow.' },
  ],
});

export const Route = createFileRoute('/stack')({
  head,
  component: StackPage,
});
