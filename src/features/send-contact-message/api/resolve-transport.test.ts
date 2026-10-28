import { describe, expect, it, vi } from 'vitest';
import type { ContactMessage } from '../model/contact-schema';
import { contactFallbackMailto, resolveContactTransport } from './resolve-transport';

const msg: ContactMessage = {
  from: 'you@company.com',
  topic: 'A role',
  message: 'A message long enough.',
  botcheck: '',
};

describe('resolveContactTransport', () => {
  it('POSTs to the configured endpoint', async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchSpy);
    const transport = resolveContactTransport({
      VITE_SITE_URL: 'https://martynov.dev',
      VITE_CONTACT_ENDPOINT: 'https://forms.test/submit',
      VITE_CONTACT_ACCESS_KEY: 'key',
    });
    await transport.send(msg);
    expect(fetchSpy).toHaveBeenCalledWith('https://forms.test/submit', expect.anything());
    vi.unstubAllGlobals();
  });

  it('opens the mail client without an endpoint', async () => {
    const assign = vi.fn();
    const location = { assign } as unknown as Location;
    const original = window.location;
    vi.stubGlobal('location', location);
    const transport = resolveContactTransport({
      VITE_SITE_URL: 'https://martynov.dev',
      VITE_CONTACT_ENDPOINT: undefined,
    });
    await transport.send(msg);
    expect(assign).toHaveBeenCalledTimes(1);
    expect(assign.mock.calls[0][0]).toMatch(/^mailto:igor\.myv@gmail\.com\?/);
    vi.stubGlobal('location', original);
    vi.unstubAllGlobals();
  });
});

describe('contactFallbackMailto', () => {
  it('targets Igor with the prefilled subject and body', () => {
    const url = contactFallbackMailto({ ...msg, subject: 'Hi' });
    expect(url.startsWith('mailto:igor.myv@gmail.com?')).toBe(true);
    expect(url).toContain(`subject=${encodeURIComponent('Hi')}`);
  });
});
