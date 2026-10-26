import { describe, expect, it } from 'vitest';
import { pageTitle, siteConfig } from './site';

describe('siteConfig', () => {
  it('points home at the ~/igor/ path', () => {
    expect(siteConfig.homePath).toBe('~/igor/');
    expect(siteConfig.timeZone).toBe('Europe/Prague');
  });
});

describe('pageTitle', () => {
  it('suffixed the window name', () => {
    expect(pageTitle('experience.md')).toBe('experience.md — Igor Martynov');
  });

  it('uses the hero title without a window name', () => {
    expect(pageTitle()).toBe('Igor Martynov — Staff Software Engineer');
  });
});
