import { createFileRoute } from '@tanstack/react-router';
import { NowPage } from '@/pages/now';

export const Route = createFileRoute('/now')({
  component: NowPage,
});
