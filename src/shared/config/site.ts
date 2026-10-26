import { env } from './env';

export const siteConfig = {
  name: 'Igor Martynov',
  url: env.VITE_SITE_URL,
  timeZone: 'Europe/Prague',
  homePath: '~/igor/',
} as const;

/** Route titles render as "<Window name> — Igor Martynov". */
export function pageTitle(name?: string) {
  return name ? `${name} — ${siteConfig.name}` : `${siteConfig.name} — Staff Software Engineer`;
}
