import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function iconProps({ size = 20, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    ...props,
  } as const;
}

/**
 * Brand glyphs copied from the contact mock — lucide 1.x has no brand icons.
 */
export function GithubIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M9 19c-4 1.5-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    </svg>
  );
}

export function TelegramIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="m22 3-20 8 7 2 2 7 4-5 5 4z" />
      <path d="m9 13 6-5" />
    </svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
    </svg>
  );
}

export function MediumIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 20h4L19 9l-4-4L4 16z" />
    </svg>
  );
}

/** The "IM" monogram tile used in the menu bar. */
export function ImMonogram({ size = 26 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className="bg-ink font-display text-paper flex items-center justify-center rounded-[7px] text-[12px] font-extrabold tracking-[-0.02em]"
    >
      IM
    </span>
  );
}
