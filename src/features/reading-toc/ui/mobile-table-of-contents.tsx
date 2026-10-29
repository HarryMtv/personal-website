import { ChevronDown } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { cn } from '@/shared/lib/cn';
import type { TocEntry } from './table-of-contents';

interface MobileTableOfContentsProps {
  items: TocEntry[];
  activeId?: string;
}

/**
 * The mobile CONTENTS bar: shows the section in view and opens the full list.
 * `top-[55px]` equals the sticky menu bar height, so the bar docks right under
 * it while the reader scrolls.
 */
export function MobileTableOfContents({ items, activeId }: MobileTableOfContentsProps) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const active = items.find((item) => item.id === activeId) ?? items[0];

  return (
    <div
      className="sticky top-[55px] z-[4] w-full min-[900px]:hidden"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          // Keep the window's useEscapeToClose (a document listener) from firing.
          event.stopPropagation();
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
        className="border-ink/15 bg-reader/95 flex w-full items-center gap-2.5 rounded-md border px-3 py-2 text-left backdrop-blur-sm"
      >
        <span className="text-muted font-mono text-[11px] font-medium tracking-[0.06em]">
          CONTENTS
        </span>
        <span className="text-ink min-w-0 flex-1 truncate text-sm font-semibold">
          {active.value}
        </span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={cn('shrink-0 transition-transform', open && 'rotate-180')}
        />
      </button>
      {open ? (
        <nav
          id={listId}
          aria-label="Contents"
          className="border-ink/15 bg-reader absolute inset-x-0 top-full mt-1 flex max-h-[60vh] flex-col gap-0.5 overflow-y-auto rounded-md border p-1.5 shadow-lg"
        >
          {items.map((item) => {
            const isActive = item.id === activeId;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={isActive ? 'location' : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  'text-ink rounded-md px-2.5 py-1.5 text-sm no-underline',
                  isActive ? 'bg-highlight font-semibold' : 'hover:bg-paper-2',
                )}
              >
                {item.value}
              </a>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}
