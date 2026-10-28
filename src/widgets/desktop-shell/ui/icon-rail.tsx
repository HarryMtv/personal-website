import { DESKTOP_ICONS } from '../config/desktop-icons';
import { DesktopIcon } from './desktop-icon';

/** A vertical icon rail (≥900px only). */
export function IconRail({ side }: { side: 'left' | 'right' }) {
  const icons = DESKTOP_ICONS.filter((icon) => icon.rail === side);

  return (
    <nav
      aria-label={side === 'left' ? 'Desktop, left' : 'Desktop, right'}
      className="hidden w-[112px] flex-col items-center gap-3.5 min-[900px]:flex"
    >
      {icons.map((icon, index) => (
        <div key={icon.id} className="w-[100px]">
          <DesktopIcon icon={icon} index={index} label={icon.label} />
        </div>
      ))}
    </nav>
  );
}
