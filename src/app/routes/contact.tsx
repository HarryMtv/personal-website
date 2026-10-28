import { createFileRoute } from '@tanstack/react-router';
import { ContactPage } from '@/pages/contact';
import { pageTitle } from '@/shared/config/site';

const head = () => ({
  meta: [
    { title: pageTitle('New message') },
    { name: 'description', content: 'Write to Igor — email is best.' },
  ],
});

export const Route = createFileRoute('/contact')({
  head,
  component: ContactPage,
});
