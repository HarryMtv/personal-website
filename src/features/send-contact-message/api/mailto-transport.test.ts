import { describe, expect, it, vi } from 'vitest';
import type { ContactMessage } from '../model/contact-schema';
import { buildMailtoUrl, createMailtoTransport } from './mailto-transport';

const msg: ContactMessage = {
  from: 'you@company.com',
  subject: 'Hello there',
  topic: 'A role',
  message: 'A message with spaces & symbols?',
  botcheck: '',
};

describe('buildMailtoUrl', () => {
  it('encodes the subject and body', () => {
    const url = buildMailtoUrl(msg, 'igor@martynov.dev');
    expect(url).toMatch(/^mailto:igor@martynov\.dev\?/);
    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('subject')).toBe('Hello there');
    expect(params.get('body')).toBe('A message with spaces & symbols?');
  });

  it('falls back to the bracketed topic subject', () => {
    const url = buildMailtoUrl({ ...msg, subject: undefined }, 'igor@martynov.dev');
    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('subject')).toMatch(/^A role — from /);
  });
});

describe('createMailtoTransport', () => {
  it('opens the prefilled mailto URL', async () => {
    const open = vi.fn();
    const transport = createMailtoTransport({ to: 'igor@martynov.dev', open });
    await transport.send(msg);
    expect(open).toHaveBeenCalledTimes(1);
    expect(open.mock.calls[0][0]).toMatch(/^mailto:igor@martynov\.dev\?/);
  });
});
