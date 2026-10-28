import { GithubIcon, LinkedinIcon, MediumIcon, TelegramIcon } from '@/shared/ui/icons/brand-icons';
import type { Social } from '../model/profile';

const ICONS: Record<Social['id'], typeof GithubIcon> = {
  github: GithubIcon,
  telegram: TelegramIcon,
  linkedin: LinkedinIcon,
  medium: MediumIcon,
};

/**
 * Renders only the socials that actually have a URL — Telegram and Medium
 * stay hidden until their links exist.
 */
export function SocialLinks({ socials }: { socials: Social[] }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
      {socials
        .filter((social) => social.url)
        .map((social) => {
          const Icon = ICONS[social.id];
          return (
            <li key={social.id}>
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-cta border-ink/15 bg-card text-ink hover:border-accent flex min-h-12 items-center gap-3 border px-3.5 py-2 font-medium no-underline"
              >
                <Icon size={20} />
                {social.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          );
        })}
    </ul>
  );
}
