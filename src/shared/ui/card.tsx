import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds the soft elevated shadow used by the aside cards. */
  elevated?: boolean;
}

/** White card on a paper surface, as in the mock's card grids. */
export function Card({ className, elevated = false, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        'rounded-card border-ink/15 bg-card flex flex-col gap-3 border p-[22px]',
        elevated && 'shadow-[0_10px_30px_rgb(30_27_24/0.08)]',
        className,
      )}
      {...props}
    />
  );
}
