import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

/** Small mono section label, e.g. "EVERY DAY", "OPEN TO". */
export function SectionLabel({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      data-slot="section-label"
      className={cn(
        'text-muted m-0 font-mono text-xs font-medium tracking-[0.06em] uppercase',
        className,
      )}
      {...props}
    />
  );
}
