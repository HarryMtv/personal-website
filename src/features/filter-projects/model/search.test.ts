import { describe, expect, it } from 'vitest';
import { projectExplorerSearchSchema } from './search';

describe('projectExplorerSearchSchema', () => {
  it('parses an empty search to all-defaults', () => {
    expect(projectExplorerSearchSchema.parse({})).toEqual({});
  });

  it('falls back to defaults on invalid values', () => {
    const parsed = projectExplorerSearchSchema.parse({ kind: 'bogus', tag: 'nope' });
    expect(parsed.kind).toBeUndefined();
    expect(parsed.tag).toBeUndefined();
  });

  it('keeps valid filters and selection', () => {
    expect(
      projectExplorerSearchSchema.parse({ kind: 'work', tag: 'typescript', selected: 'distill' }),
    ).toEqual({ kind: 'work', tag: 'typescript', selected: 'distill' });
  });
});
