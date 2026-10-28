import { describe, expect, it } from 'vitest';
import { parseEnv } from './env';

describe('parseEnv', () => {
  it('applies the default site URL', () => {
    expect(parseEnv({})).toMatchObject({ VITE_SITE_URL: 'https://martynov.dev' });
  });

  it('keeps a valid endpoint and access key', () => {
    expect(
      parseEnv({
        VITE_SITE_URL: 'https://example.com',
        VITE_CONTACT_ENDPOINT: 'https://api.web3forms.com/submit',
        VITE_CONTACT_ACCESS_KEY: 'key',
      }),
    ).toMatchObject({
      VITE_SITE_URL: 'https://example.com',
      VITE_CONTACT_ENDPOINT: 'https://api.web3forms.com/submit',
      VITE_CONTACT_ACCESS_KEY: 'key',
    });
  });

  it('treats an empty endpoint as unset', () => {
    expect(parseEnv({ VITE_CONTACT_ENDPOINT: '' }).VITE_CONTACT_ENDPOINT).toBeUndefined();
  });

  it('keeps the other vars when one is empty', () => {
    // The shipped .env.example and the Dockerfile both produce empty strings.
    const parsed = parseEnv({
      VITE_SITE_URL: 'https://example.com',
      VITE_CONTACT_ENDPOINT: '',
      VITE_CONTACT_ACCESS_KEY: 'key',
    });
    expect(parsed).toMatchObject({
      VITE_SITE_URL: 'https://example.com',
      VITE_CONTACT_ENDPOINT: undefined,
      VITE_CONTACT_ACCESS_KEY: 'key',
    });
  });

  it('treats an empty site URL and access key as unset too', () => {
    const parsed = parseEnv({
      VITE_SITE_URL: '',
      VITE_CONTACT_ACCESS_KEY: '',
    });
    expect(parsed.VITE_SITE_URL).toBe('https://martynov.dev');
    expect(parsed.VITE_CONTACT_ACCESS_KEY).toBeUndefined();
  });

  it('throws on genuinely invalid values in dev', () => {
    // Vitest runs with import.meta.env.DEV = true.
    expect(() => parseEnv({ VITE_SITE_URL: 'not-a-url' })).toThrow();
  });
});
