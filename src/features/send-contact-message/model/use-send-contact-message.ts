import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { env } from '@/shared/config/env';
import { resolveContactTransport } from '../api/resolve-transport';
import type { ContactTransport } from '../api/transport';
import type { ContactMessage } from './contact-schema';

/**
 * Sends the message through the resolved transport. The transport is chosen
 * once from the env; tests can inject their own.
 */
export function useSendContactMessage(transportOverride?: ContactTransport) {
  const transport = useMemo(
    () => transportOverride ?? resolveContactTransport(env),
    [transportOverride],
  );

  return useMutation({
    mutationKey: ['contact', 'send'],
    mutationFn: (msg: ContactMessage) => transport.send(msg),
  });
}
