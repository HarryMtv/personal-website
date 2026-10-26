import { createFileRoute } from '@tanstack/react-router';
import { WritingPage } from '@/pages/writing';

export const Route = createFileRoute('/writing/')({
  component: WritingPage,
});
