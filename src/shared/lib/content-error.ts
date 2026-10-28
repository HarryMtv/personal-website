import type { z } from 'zod';

/** Error naming the offending content file, thrown by the registries. */
export class ContentError extends Error {
  constructor(
    public readonly file: string,
    cause: z.ZodError,
  ) {
    super(`Invalid frontmatter in ${file}: ${cause.message}`, { cause });
    this.name = 'ContentError';
  }
}
