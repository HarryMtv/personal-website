import { Link } from '@tanstack/react-router';
import { m } from 'motion/react';
import { StickyNote } from '@/shared/ui/sticky-note';

/** All windows closed — the sticky note drops onto the desk. */
export function DesktopEmptyPage() {
  return (
    <div className="mx-auto mt-5 max-w-[340px]">
      <m.div
        initial={{ y: -24, rotate: -6, opacity: 0 }}
        animate={{ y: 0, rotate: -1.5, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <StickyNote label="note.txt">
          <p className="m-0">
            All windows closed. Pick any icon to open one — or start with{' '}
            <Link to="/" className="underline">
              About me
            </Link>
            .
          </p>
        </StickyNote>
      </m.div>
    </div>
  );
}
