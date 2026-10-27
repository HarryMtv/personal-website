import type { ContactMessage } from '../model/contact-schema';

/** A way to deliver a contact message — the port. */
export interface ContactTransport {
  send(msg: ContactMessage): Promise<void>;
}

/** Thrown by transports when delivery fails; drives the error state. */
export class ContactTransportError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message, { cause });
    this.name = 'ContactTransportError';
  }
}
