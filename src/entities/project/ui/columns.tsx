import type { HTMLAttributes } from 'react';

/** Two-column section wrapper used by the case-study MDX (Why / What it does). */
export function Columns({ ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className="grid gap-10 max-[760px]:grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))]"
      {...props}
    />
  );
}
