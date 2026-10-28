import { describe, expect, it } from 'vitest';
import { formatPeriod, positions } from './positions';

describe('formatPeriod', () => {
  it('renders an ongoing role with "now"', () => {
    expect(formatPeriod('2022-07', null)).toBe('Jul 2022 — now');
  });

  it('renders a closed range with both months', () => {
    expect(formatPeriod('2018-09', '2021-06')).toBe('Sep 2018 — Jun 2021');
  });
});

describe('positions', () => {
  it('holds all 5 CV positions, newest first', () => {
    expect(positions).toHaveLength(5);
    const starts = positions.map((position) => position.start);
    expect(starts).toEqual([...starts].sort().reverse());
  });

  it('keeps the Staff Wrike role with the data-grid highlight', () => {
    const wrikeStaff = positions[0];
    expect(wrikeStaff.company).toBe('Wrike');
    expect(wrikeStaff.end).toBeNull();
    const ownership = wrikeStaff.highlights.find(
      (highlight) => highlight.label === 'Project Ownership',
    );
    expect(ownership?.text).toContain('70%');
  });

  it('labels every Staff bullet', () => {
    const wrikeStaff = positions[0];
    expect(wrikeStaff.highlights).toHaveLength(6);
    expect(wrikeStaff.highlights.every((highlight) => highlight.label)).toBe(true);
  });
});
