import { createFileRoute } from '@tanstack/react-router';
import { TrashPage } from '@/pages/trash';
import { pageTitle } from '@/shared/config/site';

const head = () => ({
  meta: [
    { title: pageTitle('.trash/') },
    {
      name: 'description',
      content: 'Old experiments that might still be load-bearing.',
    },
  ],
});

export const Route = createFileRoute('/trash')({
  head,
  component: TrashPage,
});
