import { Link } from '@tanstack/react-router';
import { m } from 'motion/react';
import { useEffect } from 'react';
import { cn } from '@/shared/lib/cn';
import type { DesktopIconConfig } from '../config/desktop-icons';

/** Icons animate in on the very first mount only, staggered. */
let hasBooted = false;

interface DesktopIconProps {
  icon: DesktopIconConfig;
  /** Stagger index within its rail/grid. */
  index: number;
  /** Label shown (desktop label or shorter mobile label). */
  label: string;
  className?: string;
}

export function DesktopIcon({ icon, index, label, className }: DesktopIconProps) {
  const Icon = icon.icon;
  const shouldStagger = !hasBooted;

  useEffect(() => {
    hasBooted = true;
  }, []);

  return (
    <m.div
      initial={shouldStagger ? { opacity: 0, y: 8 } : false}
      animate={
        shouldStagger ? { opacity: 1, y: 0, transition: { delay: index * 0.04 } } : undefined
      }
      whileHover="hover"
      whileTap="tap"
      className={cn('w-full', className)}
    >
      <Link
        to={icon.to}
        activeOptions={{ exact: !icon.matchPrefix }}
        className="group flex w-full flex-col items-center gap-2 rounded-[10px] p-1.5 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFF6E2]"
        aria-label={icon.label}
      >
        <m.span
          variants={{ hover: { y: -2 }, tap: { scale: 0.96 } }}
          className="bg-paper text-ink shadow-tile flex size-[54px] items-center justify-center rounded-[14px]"
        >
          <Icon size={28} strokeWidth={1.7} aria-hidden="true" />
        </m.span>
        <m.span
          variants={{ hover: {}, tap: {} }}
          className={cn(
            'rounded-md px-[7px] py-0.5 font-sans text-[13px]/1.25 font-medium text-white [text-shadow:0_1px_2px_rgb(40_10_0/0.7)]',
            // The active label becomes the blue pill (Link adds aria-current).
            'aria-[current=page]:bg-accent aria-[current=page]:[text-shadow:none]',
          )}
        >
          {label}
        </m.span>
      </Link>
    </m.div>
  );
}
