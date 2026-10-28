import { cn } from '@/shared/lib/cn';

export interface TocEntry {
  id: string;
  value: string;
}

interface TableOfContentsProps {
  items: TocEntry[];
  activeId?: string;
}

/** The sticky CONTENTS nav; the item in view is highlighted. */
export function TableOfContents({ items, activeId }: TableOfContentsProps) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Contents"
      className="sticky top-16 flex max-w-[220px] flex-1 basis-[200px] flex-col items-start gap-0.5 self-start"
    >
      <span className="text-muted px-2.5 pb-2 font-mono text-[11px] font-medium tracking-[0.06em]">
        CONTENTS
      </span>
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={active ? 'location' : undefined}
            className={cn(
              'text-ink rounded-md px-2.5 py-1.5 text-sm no-underline',
              active ? 'bg-highlight font-semibold' : 'hover:bg-paper-2',
            )}
          >
            {item.value}
          </a>
        );
      })}
    </nav>
  );
}
