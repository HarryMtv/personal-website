import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

interface StickyNoteProps extends HTMLAttributes<HTMLDivElement> {
  /** Rotation in degrees; the mock notes sit at ±1.5deg. */
  rotate?: number;
  /** Mono filename label, e.g. "note.txt". */
  label: string;
}

/** Yellow sticky note dropped on the desk. */
export function StickyNote({ rotate = -1.5, label, className, children, ...props }: StickyNoteProps) {
  return (
    <div
      data-slot="sticky-note"
      style={{ transform: `rotate(${rotate}deg)` }}
      className={cn(
        'flex flex-col gap-1.5 bg-highlight p-5 pb-6.5 font-sans text-base/1.5 font-medium shadow-note',
        className,
      )}
      {...props}
    >
      <span className="font-mono text-xs font-medium text-note-ink">{label}</span>
      {children}
    </div>
  );
}
