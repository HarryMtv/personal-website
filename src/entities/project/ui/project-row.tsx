import { Link } from '@tanstack/react-router';
import { m } from 'motion/react';
import { FileIcon } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import type { Project } from '../model/project';

interface ProjectRowProps {
  project: Project;
  selected: boolean;
}

/** One explorer row: NAME / KIND / STACK. The selection lives in the URL. */
export function ProjectRow({ project, selected }: ProjectRowProps) {
  return (
    <Link
      to="/projects"
      search={(prev) => ({ ...prev, selected: project.slug })}
      replace
      data-selected={selected}
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
    </Link>
  );
}
