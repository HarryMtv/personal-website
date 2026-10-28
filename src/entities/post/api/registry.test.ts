import { describe, expect, it } from 'vitest';
import { getPostBySlug, getPosts, loadPost } from './registry';

describe('post registry', () => {
  it('parses every content file and lists non-drafts', () => {
    expect(getPosts()).toHaveLength(1);
    expect(getPosts()[0].slug).toBe('telegram-pm-hub-in-5-days');
  });

  it('returns undefined for unknown slugs', () => {
    expect(getPostBySlug('nope')).toBeUndefined();
  });

  it('loads the MDX body with a table of contents matching the h2 ids', async () => {
    const loaded = await loadPost('telegram-pm-hub-in-5-days');
    expect(loaded.Content).toBeTypeOf('function');
    const headings = loaded.tableOfContents.filter((item) => item.depth === 2);
    expect(headings).toHaveLength(6);
    expect(headings.map((item) => item.value)).toEqual([
      'Day 1 · Beginning',
      'Day 2 · Adapters',
      'Day 3 · Development',
      'Day 4 · Mini app',
      'Day 5 · Deploy',
      'Summary',
    ]);
    // rehype-slug derives ids from the heading text ("·" becomes a separator).
    expect(headings[0].id).toBe('day-1--beginning');
  });

  it('declares its related project slug', () => {
    const post = getPostBySlug('telegram-pm-hub-in-5-days');
    expect(post?.relatedProject).toBe('pm-telegram-hub');
  });

  it('throws when loading an unknown post slug', async () => {
    await expect(loadPost('missing-post')).rejects.toThrow(/No content for post "missing-post"/);
  });
});
