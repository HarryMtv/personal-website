import type { ContactMessage } from '../model/contact-schema';
import { ContactTransportError, type ContactTransport } from './transport';

export interface Web3FormsTransportOptions {
  endpoint: string;
  accessKey: string;
  fetchFn?: typeof fetch;
}

interface Web3FormsResponse {
  success?: boolean;
  message?: string;
}

/**
 * Adapter that POSTs to a Web3Forms-compatible endpoint. The access key is
 * public by design; the honeypot plus the dashboard's domain restrictions
 * keep the spam down (see ADR 0003).
 */
export function createWeb3FormsTransport({
  endpoint,
  accessKey,
  fetchFn = fetch,
}: Web3FormsTransportOptions): ContactTransport {
  return {
    async send(msg: ContactMessage): Promise<void> {
      let response: Response;
      try {
        response = await fetchFn(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: accessKey,
            email: msg.from,
            subject: msg.subject ?? `[${msg.topic}] from site`,
            message: msg.message,
            topic: msg.topic,
            from_name: msg.from,
            botcheck: msg.botcheck,
          }),
        });
      } catch (cause) {
        throw new ContactTransportError('Network error while sending', cause);
      }

      if (!response.ok) {
        throw new ContactTransportError(`Endpoint responded with ${response.status}`);
      }

      let data: Web3FormsResponse;
      try {
        data = (await response.json()) as Web3FormsResponse;
      } catch (cause) {
        throw new ContactTransportError('Endpoint returned invalid JSON', cause);
      }

      if (data.success !== true) {
        throw new ContactTransportError(data.message ?? 'Endpoint rejected the message');
      }
    },
  };
}
