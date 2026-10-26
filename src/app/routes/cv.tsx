import { createFileRoute } from '@tanstack/react-router';
import { CvPage } from '@/pages/cv';
import { pageTitle } from '@/shared/config/site';

const head = () => ({
  meta: [
    { title: pageTitle('CV.pdf') },
    {
      name: 'description',
      content: "Igor Martynov's CV — experience, education, skills and certifications.",
    },
  ],
});

export const Route = createFileRoute('/cv')({
  head,
  component: CvPage,
});
