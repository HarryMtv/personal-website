import { cn } from '@/shared/lib/cn';

/** Link styling shared by the desktop Contents column and the mobile dropdown. */
export function tocLinkClass(active: boolean) {
  return cn(
    'text-ink rounded-md px-2.5 py-1.5 text-sm no-underline',
    active ? 'bg-highlight font-semibold' : 'hover:bg-paper-2',
  );
}
