import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

/** The reading column wrapper for MDX bodies. */
export function Prose({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'text-ink-prose flex max-w-[700px] min-w-0 flex-col gap-5.5 text-[18px]/[1.75]',
        className,
      )}
      {...props}
    />
  );
}
