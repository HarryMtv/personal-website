import { z } from 'zod';

// Vite (and the Dockerfile's ARG passthrough) yields "" for unset vars, and
// an empty string is not a URL — normalize each field before validating so
// one empty var never drags the whole env into the fallback.
const emptyAsUndefined = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (value === '' ? undefined : value), schema);

const envSchema = z.object({
  VITE_SITE_URL: emptyAsUndefined(z.url().default('https://martynov.dev')),
  VITE_CONTACT_ENDPOINT: emptyAsUndefined(z.url().optional()),
  VITE_CONTACT_ACCESS_KEY: emptyAsUndefined(z.string().optional()),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Parses raw import.meta.env-shaped objects. Genuinely invalid values throw
 * in dev and fall back to defaults (with a log) in production builds.
 */
export function parseEnv(raw: Record<string, unknown>): Env {
  const safeParse = envSchema.safeParse(raw);
  if (safeParse.success) {
    return safeParse.data;
  }
  if (import.meta.env.DEV) {
    // Module-eval throw — name the offending keys so a .env typo doesn't
    // read as an unrelated blank page.
    throw new Error(`Invalid environment variables:\n${z.prettifyError(safeParse.error)}`);
  }
  console.error('Invalid environment variables, falling back to defaults:', safeParse.error);
  return envSchema.parse({});
}

export const env = parseEnv(import.meta.env);
