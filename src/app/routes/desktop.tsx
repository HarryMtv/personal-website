import { createFileRoute } from '@tanstack/react-router';
import { DesktopEmptyPage } from '@/pages/desktop-empty';

export const Route = createFileRoute('/desktop')({
  component: DesktopEmptyPage,
});
