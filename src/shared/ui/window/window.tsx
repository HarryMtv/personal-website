import { Link, useNavigate, type LinkProps } from '@tanstack/react-router';
import { FileIcon, X } from 'lucide-react';
import {
  createContext,
  useContext,
  useId,
  type ReactNode,
  type RefObject,
} from 'react';
import { m, useDragControls, useReducedMotion } from 'motion/react';
import { cn } from '@/shared/lib/cn';
import { useEscapeToClose } from '@/shared/lib/use-escape-to-close';
import { useMediaQuery } from '@/shared/lib/use-media-query';
import { Button } from '../button';

export interface WindowPathSegment {
  label: string;
  to?: LinkProps['to'];
}

export interface WindowProps {
  /** Title-bar path segments after the `~/igor/` prefix, e.g. `['projects/', 'pm-telegram-hub/README.md']`. */
  path: WindowPathSegment[];
  /** Small right-aligned meta, e.g. "4 items" or "6 min read". */
  meta?: ReactNode;
  /** Extra title-bar controls, e.g. zoom buttons. */
  toolbar?: ReactNode;
  /** Where the close button navigates to. */
  closeTo: LinkProps['to'];
  variant?: 'default' | 'reader' | 'document';
  maxWidth?: 'md' | 'lg' | 'xl';
  /** Suppresses the `~/igor/` prefix (the contact window is "New message"). */
  hidePrefix?: boolean;
  children: ReactNode;
}

/**
 * The drag area for windows — the desk element, provided by DesktopShell so
 * windows can be dragged within the visible desktop.
 */
export const WindowDragBoundsContext = createContext<RefObject<HTMLDivElement | null> | null>(null);

const VARIANT_BODY: Record<NonNullable<WindowProps['variant']>, string> = {
  default: 'bg-paper',
  reader: 'bg-reader',
  document: 'bg-doc-desk',
};

const MAX_WIDTH: Record<NonNullable<WindowProps['maxWidth']>, string> = {
  md: 'max-w-[760px]',
  lg: 'max-w-[1080px]',
  xl: 'max-w-[1280px]',
};

/**
 * A desktop window. One window per route; the URL is the window manager.
 * The whole article carries `view-transition-name: window` (see the `.window`
 * class) so route changes animate the swap.
 */
export function Window({
  path,
  meta,
  toolbar,
  closeTo,
  variant = 'default',
  maxWidth = 'lg',
  hidePrefix = false,
  children,
}: WindowProps) {
  const titleId = useId();
  const navigate = useNavigate();
  const dragControls = useDragControls();
  const bounds = useContext(WindowDragBoundsContext);
  const isDesktop = useMediaQuery('(min-width: 900px)');
  const prefersReducedMotion = useReducedMotion();
  const canDrag = isDesktop && !prefersReducedMotion && bounds !== null;

  useEscapeToClose(() => void navigate({ to: closeTo }));

  return (
    <m.article
      data-window=""
      data-draggable={canDrag}
      tabIndex={-1}
      aria-labelledby={titleId}
      drag={canDrag}
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={bounds ?? undefined}
      dragMomentum={false}
      className={cn(
        'window mx-auto flex w-full flex-col overflow-hidden rounded-window border border-ink/25 shadow-window',
        'max-[899px]:rounded-b-none max-[899px]:shadow-[0_-8px_30px_rgb(40_12_0/0.35)]',
        MAX_WIDTH[maxWidth],
      )}
    >
      <div
        onPointerDown={(event) => {
          if (canDrag) dragControls.start(event);
        }}
        className="flex touch-none items-center gap-2.5 border-b border-ink/15 bg-paper-2 px-4 py-2"
      >
        <FileIcon size={16} strokeWidth={1.8} className="shrink-0 text-muted-2" aria-hidden="true" />
        <span id={titleId} className="font-mono text-[13px] font-medium text-ink-2">
          {hidePrefix ? null : <span className="text-muted">~/igor/</span>}
          {path.map((segment, index) => (
            <span key={segment.label}>
              {segment.to ? (
                <Link to={segment.to} className="text-ink-2 hover:text-accent hover:underline">
                  {segment.label}
                </Link>
              ) : (
                segment.label
              )}
              {index < path.length - 1 ? '/' : null}
            </span>
          ))}
        </span>
        <div className="ml-auto flex items-center gap-2">
          {meta ? <span className="font-mono text-xs text-muted">{meta}</span> : null}
          {toolbar}
          <Button asChild variant="window" aria-label="Close window">
            <Link to={closeTo}>
              <X size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
      <div className={cn('flex-1', VARIANT_BODY[variant])}>{children}</div>
    </m.article>
  );
}
