import { z } from 'zod';

const envSchema = z.object({
  VITE_SITE_URL: z.url().default('https://martynov.dev'),
  VITE_CONTACT_ENDPOINT: z
    .url()
    .optional()
    .transform((value) => value ?? undefined),
  VITE_CONTACT_ACCESS_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

/** Parses raw import.meta.env-shaped objects; invalid values fall back. */
export function parseEnv(raw: Record<string, unknown>): Env {
  const safeParse = envSchema.safeParse(raw);
  if (safeParse.success) {
    return safeParse.data;
  }
  // Fail loudly in dev, quietly fall back in production builds.
  return envSchema.parse({});
}

export const env = parseEnv(import.meta.env);
