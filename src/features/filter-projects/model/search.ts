import { z } from 'zod';
import { PROJECT_TAGS } from '@/entities/project';

/**
 * URL state for the projects explorer. Invalid values fall back to defaults
 * (`.catch`) so bad deep links never crash the window. `kind` stays optional
 * so plain links to /projects stay valid — absent means "all".
 */
export const projectExplorerSearchSchema = z.object({
  kind: z.enum(['all', 'side', 'work', 'experiment']).optional().catch(undefined),
  tag: z.enum(PROJECT_TAGS).optional().catch(undefined),
  selected: z.string().optional().catch(undefined),
});

export type ProjectExplorerSearch = z.infer<typeof projectExplorerSearchSchema>;
