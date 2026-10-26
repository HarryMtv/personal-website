import { createFileRoute } from '@tanstack/react-router';
import { HobbiesPage } from '@/pages/hobbies';
import { pageTitle } from '@/shared/config/site';

const head = () => ({
  meta: [
    { title: pageTitle('hobbies.md') },
    { name: 'description', content: 'Games, outdoors, music and languages — off the clock.' },
  ],
});

export const Route = createFileRoute('/hobbies')({
  head,
  component: HobbiesPage,
});
