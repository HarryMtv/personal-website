import type { ReactNode } from 'react';

/** The amber-bordered pull quote from the blog mock. */
export function PullQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="border-amber font-display text-[22px]/1.45 text-ink m-0 border-l-[3px] py-1 pl-5 font-medium">
      {children}
    </blockquote>
  );
}
