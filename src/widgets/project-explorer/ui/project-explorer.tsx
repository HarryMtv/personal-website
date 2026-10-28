import { Link } from '@tanstack/react-router';
import { m, useReducedMotion } from 'motion/react';
import { useLayoutEffect, useRef, useState } from 'react';
import { ProjectPreview, ProjectRow, type Project } from '@/entities/project';
import { FilterSidebar, type ProjectExplorerSearch } from '@/features/filter-projects';

interface ProjectExplorerProps {
  projects: Project[];
  search: ProjectExplorerSearch;
  /** Already filtered and resolved by the page. */
  selected: Project | undefined;
}

/**
 * The projects/ file explorer: filter sidebar, the row list and the preview
 * pane. Pure — the page owns the URL search and the filtering.
 */
export function ProjectExplorer({ projects, search, selected }: ProjectExplorerProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | 'auto'>('auto');
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const element = contentRef.current;
    if (!element || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => setHeight(entry.borderBoxSize[0].blockSize));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    // Search-only navigations skip the route view transition (see router.ts),
    // so the window's height change is animated here instead.
    <m.div
      initial={false}
      animate={{ height }}
      transition={
        prefersReducedMotion ? { duration: 0 } : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
      }
      className="overflow-hidden"
    >
      <div ref={contentRef} className="flex min-h-[640px] flex-wrap">
        <FilterSidebar search={search} />
        <div className="flex min-w-0 flex-1 basis-[420px] flex-col gap-0.5 px-3.5 pt-3.5 pb-5">
          <div className="text-muted hidden grid-cols-[minmax(0,1fr)_auto] gap-x-3 px-3 pt-1.5 pb-1.5 font-mono text-[11px] font-medium tracking-[0.06em] min-[760px]:grid">
            <span>NAME</span>
            <span className="pr-1 pl-14">KIND · STACK</span>
          </div>
          {projects.map((project) => (
            <ProjectRow
              key={project.slug}
              project={project}
              selected={selected?.slug === project.slug}
            />
          ))}
          {projects.length === 0 ? (
            <div className="flex flex-col items-start gap-3 p-6">
              <p className="text-ink-2 m-0">No files match these filters.</p>
              <Link
                to="/projects"
                search={{ kind: 'all', selected: undefined }}
                className="text-accent underline-offset-2 hover:underline"
              >
                Clear filters
              </Link>
            </div>
          ) : null}
        </div>
        {selected ? <ProjectPreview project={selected} /> : null}
      </div>
    </m.div>
  );
}
