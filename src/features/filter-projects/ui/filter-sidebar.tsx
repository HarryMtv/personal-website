import { useNavigate } from '@tanstack/react-router';
import {
  PROJECT_KIND_LABELS,
  PROJECT_TAG_META,
  type ProjectKind,
  type ProjectTag,
} from '@/entities/project';
import { cn } from '@/shared/lib/cn';
import type { ProjectExplorerSearch } from '../model/search';

const KINDS: ('all' | ProjectKind)[] = ['all', 'side', 'work', 'experiment'];
const TAGS = Object.keys(PROJECT_TAG_META) as ProjectTag[];

interface FilterSidebarProps {
  search: Pick<ProjectExplorerSearch, 'kind' | 'tag'>;
}

/**
 * The LOCATIONS / TAGS sidebar. Every choice is written into the URL (the
 * single source of truth) and clears the selection; clicking the active tag
 * again clears it. Buttons instead of Links: TanStack Link's own active
 * detection collides with the filter's aria-current semantics. Filtering is
 * in-place state, so the scroll position is kept (`resetScroll: false`).
 */
export function FilterSidebar({ search }: FilterSidebarProps) {
  const navigate = useNavigate();
  const activeKind = search.kind ?? 'all';

  const setKind = (kind: 'all' | ProjectKind) =>
    navigate({
      to: '/projects',
      search: (prev: ProjectExplorerSearch) => ({ ...prev, kind, selected: undefined }),
      resetScroll: false,
    });

  const toggleTag = (tag: ProjectTag) =>
    navigate({
      to: '/projects',
      search: (prev: ProjectExplorerSearch) => ({
        ...prev,
        tag: search.tag === tag ? undefined : tag,
        selected: undefined,
      }),
      resetScroll: false,
    });

  return (
    <nav
      aria-label="Filters"
      className="bg-paper-3 border-ink/12 flex max-w-[240px] min-w-0 flex-1 basis-[200px] flex-col gap-0.5 border-r px-3 pt-4.5 pb-4 max-[760px]:max-w-none max-[760px]:border-r-0 max-[760px]:border-b"
    >
      <span className="text-muted px-2.5 pt-1 pb-1.5 font-mono text-[11px] font-medium tracking-[0.06em]">
        LOCATIONS
      </span>
      {KINDS.map((kind) => (
        <button
          key={kind}
          type="button"
          onClick={() => void setKind(kind)}
          aria-current={activeKind === kind ? 'true' : undefined}
          className={cn(
            'text-ink cursor-pointer rounded-md border-0 bg-transparent px-2.5 py-1.5 text-left text-sm hover:bg-white',
            activeKind === kind && 'bg-white font-semibold',
          )}
        >
          {PROJECT_KIND_LABELS[kind]}
        </button>
      ))}
      <span className="text-muted px-2.5 pt-4.5 pb-1.5 font-mono text-[11px] font-medium tracking-[0.06em]">
        TAGS
      </span>
      {TAGS.map((tag) => {
        const active = search.tag === tag;
        return (
          <button
            key={tag}
            type="button"
            onClick={() => void toggleTag(tag)}
            aria-current={active ? 'true' : undefined}
            className={cn(
              'text-ink flex cursor-pointer items-center gap-2 rounded-md border-0 bg-transparent px-2.5 py-1.5 text-left text-sm hover:bg-white',
              active && 'bg-white font-semibold',
            )}
          >
            <span
              aria-hidden="true"
              className="size-[9px] rounded-full"
              style={{ background: PROJECT_TAG_META[tag].color }}
            />
            {PROJECT_TAG_META[tag].label}
          </button>
        );
      })}
    </nav>
  );
}
