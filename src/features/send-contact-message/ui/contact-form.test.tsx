import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithRouter } from '@/shared/lib/test/render-with-router';
import { useContactDraftStore } from '../model/contact-draft-store';
import type { ContactTransport } from '../api/transport';
import { ContactForm } from './contact-form';

function createTransport(behaviour: () => Promise<void>): ContactTransport {
  return { send: vi.fn(behaviour) };
}

async function mountContact(transport: ContactTransport) {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  const result = await renderWithRouter(
    <QueryClientProvider client={client}>
      <ContactForm transport={transport} />
    </QueryClientProvider>,
  );
  return result;
}

describe('ContactForm', () => {
  beforeEach(() => {
    sessionStorage.clear();
    useContactDraftStore.setState({ from: '', subject: '', topic: 'A role', message: '' });
  });

  it('shows inline errors and focuses the first invalid field on submit', async () => {
    const user = userEvent.setup();
    await mountContact(createTransport(vi.fn().mockResolvedValue(undefined)));

    await user.click(screen.getByRole('button', { name: /send message/i }));

    const from = screen.getByLabelText(/from/i);
    expect(from).toHaveAttribute('aria-invalid', 'true');
    expect(from).toHaveAttribute('aria-describedby', 'from-error');
    expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
    expect(screen.getByText(/10\+ characters/i)).toBeInTheDocument();
    expect(from).toHaveFocus();
  });

  it('validates on change only after a failed submit', async () => {
    const user = userEvent.setup();
    await mountContact(createTransport(vi.fn().mockResolvedValue(undefined)));

    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(screen.getByText('Enter a valid email')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/from/i), 'you@company.com');
    await waitFor(() => expect(screen.queryByText('Enter a valid email')).not.toBeInTheDocument());
  });

  it('disables the button and shows Sending… while pending', async () => {
    let resolveSend: () => void = () => undefined;
    const transport = createTransport(
      () => new Promise<void>((resolve) => (resolveSend = resolve)),
    );
    const user = userEvent.setup();
    await mountContact(transport);

    await user.type(screen.getByLabelText(/from/i), 'you@company.com');
    await user.type(screen.getByPlaceholderText(/hi igor/i), 'this is a long enough message');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    const button = screen.getByRole('button', { name: /sending…/i });
    expect(button).toBeDisabled();

    act(() => {
      resolveSend();
    });
    await waitFor(() => expect(screen.getByTestId('contact-success')).toBeInTheDocument());
  });

  it('clears the draft on success', async () => {
    const user = userEvent.setup();
    await mountContact(createTransport(vi.fn().mockResolvedValue(undefined)));

    await user.type(screen.getByLabelText(/from/i), 'you@company.com');
    await user.type(screen.getByPlaceholderText(/hi igor/i), 'this is a long enough message');
    await user.click(screen.getByRole('button', { name: /send message/i }));
    await waitFor(() => expect(screen.getByTestId('contact-success')).toBeInTheDocument());

    expect(useContactDraftStore.getState().from).toBe('');
    expect(useContactDraftStore.getState().message).toBe('');
  });

  it('keeps values, shows the alert and the mailto fallback on error', async () => {
    const transport = createTransport(vi.fn().mockRejectedValue(new Error('boom')));
    const user = userEvent.setup();
    await mountContact(transport);

    await user.type(screen.getByLabelText(/from/i), 'you@company.com');
    await user.type(screen.getByPlaceholderText(/hi igor/i), 'this is a long enough message');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    const mailto = screen.getByRole('link', { name: /email me directly/i });
    expect(mailto.getAttribute('href')).toMatch(/^mailto:igor\.myv@gmail\.com\?/);
    expect(useContactDraftStore.getState().from).toBe('you@company.com');
  });

  it('selects topics via the keyboard-accessible radio group', async () => {
    const user = userEvent.setup();
    await mountContact(createTransport(vi.fn().mockResolvedValue(undefined)));

    const consulting = screen.getByRole('radio', { name: 'Consulting' });
    expect(consulting).not.toBeChecked();
    await user.click(consulting);
    expect(consulting).toBeChecked();
    expect(useContactDraftStore.getState().topic).toBe('Consulting');
  });

  it('hides the honeypot from humans', async () => {
    await mountContact(createTransport(vi.fn().mockResolvedValue(undefined)));
    const honeypot = document.querySelector<HTMLInputElement>('input[name="botcheck"]');
    expect(honeypot).not.toBeNull();
    expect(honeypot).toHaveAttribute('aria-hidden', 'true');
    expect(honeypot!.tabIndex).toBe(-1);
  });
});
