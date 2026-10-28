import { createFileRoute } from '@tanstack/react-router';
import { DesktopEmptyPage } from '@/pages/desktop-empty';
import { pageTitle } from '@/shared/config/site';

const head = () => ({
  meta: [{ title: pageTitle('Desktop') }],
});

export const Route = createFileRoute('/desktop')({
  head,
  component: DesktopEmptyPage,
});
