import { profile } from '@/entities/profile';
import type { Env } from '@/shared/config/env';
import type { ContactMessage } from '../model/contact-schema';
import { buildMailtoUrl } from './mailto-transport';
import { createMailtoTransport } from './mailto-transport';
import type { ContactTransport } from './transport';
import { createWeb3FormsTransport } from './web3forms-transport';

export const CONTACT_RECIPIENT = profile.email;

/**
 * Picks the transport at runtime: Web3Forms when an endpoint is configured,
 * the visitor's mail client otherwise (ADR 0003).
 */
export function resolveContactTransport(env: Env): ContactTransport {
  if (env.VITE_CONTACT_ENDPOINT) {
    return createWeb3FormsTransport({
      endpoint: env.VITE_CONTACT_ENDPOINT,
      accessKey: env.VITE_CONTACT_ACCESS_KEY ?? '',
    });
  }
  return createMailtoTransport({ to: CONTACT_RECIPIENT });
}

/** The mailto fallback shown in the error state. */
export function contactFallbackMailto(msg: ContactMessage): string {
  return buildMailtoUrl(msg, CONTACT_RECIPIENT);
}
