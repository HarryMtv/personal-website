import { useNavigate, useRouter } from '@tanstack/react-router';
import { m } from 'motion/react';
import { FileIcon } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { type Project, type ProjectKind, type ProjectTag } from '../model/project';

interface ProjectRowProps {
  project: Project;
  selected: boolean;
}

/**
 * The /projects search from the entity's own vocabulary (the route schema
 * lives in `features/filter-projects`, which may not be imported from here).
 */
interface ProjectsSearch {
  kind?: 'all' | ProjectKind;
  tag?: ProjectTag;
  selected?: string;
}

/** One explorer row: NAME / KIND / STACK. The selection lives in the URL. */
export function ProjectRow({ project, selected }: ProjectRowProps) {
  const router = useRouter();
  const navigate = useNavigate();
  const nextSearch = (prev: ProjectsSearch): ProjectsSearch => ({
    ...prev,
    selected: project.slug,
  });
  // A plain anchor, not a Link: the row targets the route it already sits
  // on, which the router would mark aria-current="page" — selection is not
  // a page, so the href is built by hand and the marker stays ours.
  const href = router.buildLocation({ to: '/projects', search: nextSearch }).href;

  return (
    <a
      href={href}
      aria-current={selected ? 'true' : undefined}
      data-selected={selected}
      onClick={(event) => {
        // Modified clicks fall through to the real href in a new tab.
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
          return;
        event.preventDefault();
        // Selection is in-place state: keep the scroll position (mobile stacks the list).
        void navigate({ to: '/projects', search: nextSearch, replace: true, resetScroll: false });
      }}
      className={cn(
        'text-ink relative grid items-center gap-x-3 rounded-md px-3 py-2.5 text-sm',
        'grid-cols-[minmax(0,1fr)_auto] max-[760px]:grid-cols-1',
        !selected && 'hover:bg-white',
      )}
    >
      {selected ? (
        <m.span
          aria-hidden="true"
          layoutId="explorer-selection"
          className="bg-accent absolute inset-0 rounded-md"
        />
      ) : null}
      <span
        className={cn(
          'relative flex min-w-0 items-center gap-2.5 truncate font-semibold',
          selected && 'text-white',
        )}
      >
        <FileIcon size={14} aria-hidden="true" className="shrink-0 opacity-70" />
        {project.slug}
      </span>
      <span className="relative flex gap-4 max-[760px]:hidden">
        <span className={cn('w-28 shrink-0', selected ? 'text-white/90' : 'text-ink')}>
          {project.kindLabel}
        </span>
        <span className={cn('font-mono text-xs', selected ? 'text-white/90' : 'text-ink-3')}>
          {project.stackShort}
        </span>
      </span>
    </a>
  );
}
