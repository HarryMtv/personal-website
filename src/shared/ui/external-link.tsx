import type { AnchorHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

/** External link that opens in a new tab with a screen-reader hint. */
export function ExternalLink({ className, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      data-slot="external-link"
      target="_blank"
      rel="noopener noreferrer"
      className={cn('text-accent underline-offset-2 hover:text-accent-hover hover:underline', className)}
      {...props}
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
