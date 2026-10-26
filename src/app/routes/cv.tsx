import { createFileRoute } from '@tanstack/react-router';
import { CvPage } from '@/pages/cv';

export const Route = createFileRoute('/cv')({
  component: CvPage,
});
