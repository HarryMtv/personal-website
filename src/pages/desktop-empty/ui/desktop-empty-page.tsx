import { Link } from '@tanstack/react-router';
import { StickyNote } from '@/shared/ui/sticky-note';

/** All windows closed — just the sticky note on the desk. */
export function DesktopEmptyPage() {
  return (
    <div className="mx-auto mt-5 max-w-[340px]">
      <StickyNote label="note.txt">
        <p className="m-0">
          All windows closed. Pick any icon to open one — or start with{' '}
          <Link to="/" className="underline">
            About me
          </Link>
          .
        </p>
      </StickyNote>
    </div>
  );
}
