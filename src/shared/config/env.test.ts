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
});
