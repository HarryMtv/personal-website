import { createFileRoute } from '@tanstack/react-router';
import { HobbiesPage } from '@/pages/hobbies';

export const Route = createFileRoute('/hobbies')({
  component: HobbiesPage,
});
