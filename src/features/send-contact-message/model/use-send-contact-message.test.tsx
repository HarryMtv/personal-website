import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { ContactMessage } from './contact-schema';
import { useSendContactMessage } from './use-send-contact-message';

const msg: ContactMessage = {
  from: 'you@x.com',
  topic: 'A role',
  message: 'A message long enough.',
  botcheck: '',
};

function withQueryClient({ children }: PropsWithChildren) {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useSendContactMessage', () => {
  it('sends through the injected transport', async () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useSendContactMessage({ send }), {
      wrapper: withQueryClient,
    });

    act(() => result.current.mutate(msg));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(send).toHaveBeenCalledWith(msg);
  });

  it('surfaces transport failures as errors', async () => {
    const send = vi.fn().mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useSendContactMessage({ send }), {
      wrapper: withQueryClient,
    });

    act(() => result.current.mutate(msg));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
