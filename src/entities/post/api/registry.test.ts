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
    expect(headings).toHaveLength(5);
    expect(headings.map((item) => item.value)).toEqual([
      'Day 1 · Spec first',
      'Day 2 · [Title]',
      'Day 3 · [Title]',
      'Day 4 · [Title]',
      'Day 5 · [Title]',
    ]);
    // rehype-slug derives ids from the heading text ("·" becomes a separator).
    expect(headings[0].id).toBe('day-1--spec-first');
  });

  it('declares its related project slug', () => {
    const post = getPostBySlug('telegram-pm-hub-in-5-days');
    expect(post?.relatedProject).toBe('pm-telegram-hub');
  });
});
