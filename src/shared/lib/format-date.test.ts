import { describe, expect, it } from 'vitest';
import { formatDate } from './format-date';

describe('formatDate', () => {
  it('returns "Draft" without a date', () => {
    expect(formatDate()).toBe('Draft');
    expect(formatDate(undefined)).toBe('Draft');
  });

  it('formats ISO dates in en-GB style', () => {
    expect(formatDate('2026-07-12')).toMatch(/^12 Jul 2026$/);
  });
});
