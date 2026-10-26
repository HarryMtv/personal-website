import { useRef, type PropsWithChildren } from 'react';
import { WindowDragBoundsContext } from '@/shared/ui/window';
import { useFocusWindowOnNavigate } from '../model/use-focus-window-on-navigate';
import { IconRail } from './icon-rail';
import { MenuBar } from './menu-bar';
import { MobileIconGrid } from './mobile-icon-grid';
import { SkipLink } from './skip-link';

/**
 * The desktop: tiled wallpaper, sticky menu bar, icon rails and the window
 * slot holding the routed page. Below 900px the rails collapse into a
 * 4-column icon grid above the window.
 */
export function DesktopShell({ children }: PropsWithChildren) {
  const deskRef = useRef<HTMLDivElement>(null);
  useFocusWindowOnNavigate();

  return (
    <div className="wallpaper flex min-h-screen flex-col bg-desk text-ink">
      <SkipLink />
      <MenuBar />
      <MobileIconGrid />
      <div className="flex flex-1 flex-col gap-6 px-4 pb-10 min-[900px]:grid min-[900px]:grid-cols-[112px_minmax(0,1fr)_112px] min-[900px]:gap-6 min-[900px]:px-5 min-[900px]:pt-7 min-[900px]:pb-12">
        <IconRail side="left" />
        <div className="flex min-w-0 flex-col max-[899px]:px-0">
          <section id="window-slot" aria-label="Window" className="min-w-0" ref={deskRef}>
            <WindowDragBoundsContext.Provider value={deskRef}>
              {children}
            </WindowDragBoundsContext.Provider>
          </section>
        </div>
        <IconRail side="right" />
      </div>
    </div>
  );
}
