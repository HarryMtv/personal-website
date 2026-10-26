import { describe, expect, it } from 'vitest';
import { DESKTOP_ICONS } from './desktop-icons';

describe('DESKTOP_ICONS', () => {
  it('has unique ids and labels', () => {
    const ids = DESKTOP_ICONS.map((icon) => icon.id);
    expect(new Set(ids).size).toBe(ids.length);
    const labels = DESKTOP_ICONS.map((icon) => icon.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it('fills both rails with the mock inventory', () => {
    const left = DESKTOP_ICONS.filter((icon) => icon.rail === 'left').map((icon) => icon.id);
    const right = DESKTOP_ICONS.filter((icon) => icon.rail === 'right').map((icon) => icon.id);
    expect(left).toEqual(['about', 'projects', 'experience', 'stack', 'writing']);
    expect(right).toEqual(['hobbies', 'now', 'contact', 'cv', 'trash']);
  });

  it('shows exactly 8 icons on mobile', () => {
    expect(DESKTOP_ICONS.filter((icon) => icon.showOnMobile)).toHaveLength(8);
  });

  it('prefix-matches only the nested-route icons', () => {
    const prefixIds = DESKTOP_ICONS.filter((icon) => icon.matchPrefix).map((icon) => icon.id);
    expect(prefixIds).toEqual(['projects', 'writing']);
  });
});
