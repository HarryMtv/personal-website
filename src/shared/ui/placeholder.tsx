import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

interface PlaceholderProps extends HTMLAttributes<HTMLDivElement> {
  /** CSS aspect-ratio, e.g. "16/10". */
  ratio?: string;
  /** Caption under the dashed box. */
  caption?: string;
}

/** Dashed screenshot placeholder — no real screenshots exist yet. */
export function Placeholder({ ratio = '16/10', caption, className, ...props }: PlaceholderProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)} {...props}>
      <div
        data-slot="placeholder"
        style={{ aspectRatio: ratio }}
        className="flex w-full items-center justify-center rounded-card border-2 border-dashed border-ink/30 bg-white/60 font-mono text-xs text-muted"
      >
        screenshot
      </div>
      {caption ? <p className="m-0 font-mono text-xs text-muted">{caption}</p> : null}
    </div>
  );
}
