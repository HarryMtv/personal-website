import { createFileRoute } from '@tanstack/react-router';
import { TrashPage } from '@/pages/trash';

export const Route = createFileRoute('/trash')({
  component: TrashPage,
});
