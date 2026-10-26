import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

/** Mono tag chip used for tech stacks and file kinds. */
export function Chip({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="chip"
      className={cn(
        'bg-paper-2 text-ink inline-flex items-center rounded-[5px] px-2 py-1 font-mono text-xs font-medium',
        className,
      )}
      {...props}
    />
  );
}
