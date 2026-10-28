import { DESKTOP_ICONS } from '../config/desktop-icons';
import { DesktopIcon } from './desktop-icon';

/** The 4-column icon grid shown below 900px instead of the rails. */
export function MobileIconGrid() {
  const icons = DESKTOP_ICONS.filter((icon) => icon.showOnMobile);

  return (
    <nav
      aria-label="Desktop"
      className="grid grid-cols-4 gap-x-2 gap-y-3.5 px-4 pt-5 pb-4 min-[900px]:hidden"
    >
      {icons.map((icon, index) => (
        <DesktopIcon key={icon.id} icon={icon} index={index} label={icon.mobileLabel} />
      ))}
    </nav>
  );
}
