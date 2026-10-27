import { describe, expect, it, vi } from 'vitest';
import type { ContactMessage } from '../model/contact-schema';
import { ContactTransportError } from './transport';
import { createWeb3FormsTransport } from './web3forms-transport';

const msg: ContactMessage = {
  from: 'you@company.com',
  subject: 'Hello',
  topic: 'A role',
  message: 'A message long enough.',
  botcheck: '',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

describe('createWeb3FormsTransport', () => {
  it('POSTs the Web3Forms payload', async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse({ success: true }));
    const transport = createWeb3FormsTransport({
      endpoint: 'https://api.web3forms.com/submit',
      accessKey: 'key',
      fetchFn,
    });

    await transport.send(msg);

    expect(fetchFn).toHaveBeenCalledWith(
      'https://api.web3forms.com/submit',
      expect.objectContaining({ method: 'POST' }),
    );
    const init = fetchFn.mock.calls[0][1] as RequestInit;
    expect(init.headers).toMatchObject({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    expect(JSON.parse(init.body as string)).toEqual({
      access_key: 'key',
      email: 'you@company.com',
      subject: 'Hello',
      message: 'A message long enough.',
      topic: 'A role',
      from_name: 'you@company.com',
      botcheck: '',
    });
  });

  it('falls back to the bracketed subject', async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse({ success: true }));
    const transport = createWeb3FormsTransport({
      endpoint: 'https://x.test',
      accessKey: 'key',
      fetchFn,
    });
    await transport.send({ ...msg, subject: undefined });
    const init = fetchFn.mock.calls[0][1] as RequestInit;
    const payload = JSON.parse(init.body as string) as { subject: string };
    expect(payload.subject).toBe('[A role] from site');
  });

  it('throws on a non-2xx response', async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse({}, 500));
    const transport = createWeb3FormsTransport({
      endpoint: 'https://x.test',
      accessKey: 'k',
      fetchFn,
    });
    await expect(transport.send(msg)).rejects.toThrow(ContactTransportError);
    await expect(transport.send(msg)).rejects.toThrow(/500/);
  });

  it('throws when the endpoint reports failure', async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse({ success: false, message: 'nope' }));
    const transport = createWeb3FormsTransport({
      endpoint: 'https://x.test',
      accessKey: 'k',
      fetchFn,
    });
    await expect(transport.send(msg)).rejects.toThrow(/nope/);
  });

  it('wraps network failures', async () => {
    const fetchFn = vi.fn().mockRejectedValue(new TypeError('fetch failed'));
    const transport = createWeb3FormsTransport({
      endpoint: 'https://x.test',
      accessKey: 'k',
      fetchFn,
    });
    await expect(transport.send(msg)).rejects.toThrow(ContactTransportError);
  });
});
