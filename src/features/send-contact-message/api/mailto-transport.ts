import { siteConfig } from '@/shared/config/site';
import type { ContactMessage } from '../model/contact-schema';
import type { ContactTransport } from './transport';

/** Builds the prefilled mailto: URL for a message. */
export function buildMailtoUrl(msg: ContactMessage, to: string): string {
  const subject = msg.subject ?? `${msg.topic} — from ${siteConfig.url.replace('https://', '')}`;
  const params = new URLSearchParams({
    subject,
    body: msg.message,
  });
  return `mailto:${to}?${params.toString()}`;
}

export interface MailtoTransportOptions {
  to: string;
  /** Injectable for tests. */
  open?: (url: string) => void;
}

/** Adapter that hands the message to the visitor's mail client. */
export function createMailtoTransport({ to, open }: MailtoTransportOptions): ContactTransport {
  const openUrl = open ?? ((url: string) => window.location.assign(url));
  return {
    send(msg: ContactMessage): Promise<void> {
      openUrl(buildMailtoUrl(msg, to));
      return Promise.resolve();
    },
  };
}
