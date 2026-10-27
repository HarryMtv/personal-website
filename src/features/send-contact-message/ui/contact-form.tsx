import { m } from 'motion/react';
import { useState, type FormEvent } from 'react';
import { Button } from '@/shared/ui/button';
import { env } from '@/shared/config/env';
import { contactFallbackMailto } from '../api/resolve-transport';
import type { ContactTransport } from '../api/transport';
import { contactMessageSchema, type ContactMessage } from '../model/contact-schema';
import { useContactDraftStore } from '../model/contact-draft-store';
import { useSendContactMessage } from '../model/use-send-contact-message';
import { TopicPills } from './topic-pills';

type FieldErrors = Partial<Record<'from' | 'subject' | 'message', string>>;

/** Mail-compose form; controlled by the persisted draft store. */
export function ContactForm({ transport }: { transport?: ContactTransport }) {
  const draft = useContactDraftStore();
  const mutation = useSendContactMessage(transport);
  const isMailtoMode = !env.VITE_CONTACT_ENDPOINT;
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [lastMessage, setLastMessage] = useState<ContactMessage | undefined>(undefined);

  const validate = (): { message?: ContactMessage; fieldErrors: FieldErrors } => {
    // Read the store directly: event handlers see the freshest values.
    const { from, subject, topic, message, botcheck } = useContactDraftStore.getState();
    const candidate = {
      from,
      subject: subject || undefined,
      topic,
      message,
      botcheck,
    };
    const parsed = contactMessageSchema.safeParse(candidate);
    if (parsed.success) {
      setErrors({});
      return { message: parsed.data, fieldErrors: {} };
    }
    const fieldErrors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === 'from' || key === 'subject' || key === 'message') {
        fieldErrors[key] ??= issue.message;
      }
    }
    setErrors(fieldErrors);
    return { fieldErrors };
  };

  const focusFirstInvalid = (fieldErrors: FieldErrors) => {
    for (const key of ['from', 'subject', 'message'] as const) {
      if (fieldErrors[key]) {
        document.querySelector<HTMLElement>(`[name="${key}"]`)?.focus();
        return;
      }
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const { message, fieldErrors } = validate();
    if (!message) {
      focusFirstInvalid(fieldErrors);
      return;
    }
    setLastMessage(message);
    mutation.mutate(message, {
      onSuccess: () => draft.reset(),
    });
  };

  const handleChange = (name: 'from' | 'subject' | 'message', value: string) => {
    draft.setField(name, value);
    // Re-validate as the visitor types, but only after a failed submit.
    if (submitted) validate();
  };

  if (mutation.isSuccess) {
    return (
      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-1 flex-col items-start justify-center gap-4 p-8"
        data-testid="contact-success"
      >
        <p className="text-lg/1.6 text-ink-2 m-0">
          {isMailtoMode
            ? 'Your mail app should open now.'
            : "Message sent — I'll reply within a few days."}
        </p>
        <Button variant="secondary" onClick={() => mutation.reset()}>
          Write another
        </Button>
      </m.div>
    );
  }

  const pendingMessage = mutation.isPending ? (
    <span className="text-ink-3 text-[14px]">Sending…</span>
  ) : (
    <span className="text-ink-3 text-[14px]">I usually reply within a few days.</span>
  );

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-1 flex-col"
      aria-label="New message"
    >
      <div className="border-ink/12 grid grid-cols-[90px_minmax(0,1fr)] items-center gap-3 border-b px-5 py-2.5 max-[560px]:grid-cols-1 max-[560px]:items-start">
        <label htmlFor="to" className="text-muted font-mono text-[13px]">
          To
        </label>
        <span
          id="to"
          className="bg-accent-soft text-accent-hover inline-flex w-fit items-center rounded-full px-2.5 py-1 text-sm font-medium"
        >
          Igor Martynov
        </span>
      </div>

      <FieldRow label="From" name="from" invalid={Boolean(errors.from)} error={errors.from}>
        {(props) => (
          <input
            {...props}
            type="email"
            placeholder="you@company.com"
            value={draft.from}
            onChange={(event) => handleChange('from', event.target.value)}
          />
        )}
      </FieldRow>

      <FieldRow
        label="Subject"
        name="subject"
        invalid={Boolean(errors.subject)}
        error={errors.subject}
        optional
      >
        {(props) => (
          <input
            {...props}
            type="text"
            placeholder="What's this about?"
            value={draft.subject}
            onChange={(event) => handleChange('subject', event.target.value)}
          />
        )}
      </FieldRow>

      <div className="border-ink/12 flex flex-wrap gap-2 border-b px-5 py-3.5">
        <TopicPills value={draft.topic} onChange={(topic) => draft.setField('topic', topic)} />
      </div>

      <label htmlFor="message" className="sr-only">
        Message
      </label>
      <textarea
        id="message"
        name="message"
        required
        aria-invalid={Boolean(errors.message) || undefined}
        aria-describedby={errors.message ? 'message-error' : undefined}
        placeholder="Hi Igor, …"
        value={draft.message}
        onChange={(event) => handleChange('message', event.target.value)}
        className="text-base/1.6 text-ink min-h-[260px] flex-1 resize-y border-0 bg-transparent p-5 outline-none"
      />
      {errors.message ? (
        <p id="message-error" role="alert" className="text-destructive m-0 px-5 pb-1 text-sm">
          {errors.message}
        </p>
      ) : null}

      {/* Honeypot: hidden from humans, catnip for bots. */}
      <input
        type="text"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={draft.botcheck}
        onChange={(event) => draft.setField('botcheck', event.target.value)}
        className="absolute -left-[9999px] size-0 opacity-0"
      />

      {mutation.isError ? (
        <div
          role="alert"
          className="rounded-cta border-destructive/40 bg-destructive/5 mx-5 mb-3 flex flex-wrap items-center gap-3 border px-4 py-3 text-sm"
        >
          <span>That didn&rsquo;t send.</span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => lastMessage && mutation.mutate(lastMessage)}
          >
            Try again
          </Button>
          <a
            className="text-accent underline-offset-2 hover:underline"
            href={contactFallbackMailto({
              from: draft.from || 'unknown@example.com',
              subject: draft.subject || undefined,
              topic: draft.topic,
              message: draft.message,
              botcheck: draft.botcheck,
            })}
          >
            Email me directly
          </a>
        </div>
      ) : null}

      <div className="border-ink/12 flex flex-wrap items-center gap-3 border-t px-5 py-3.5">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Sending…' : 'Send message'}
        </Button>
        {pendingMessage}
      </div>
    </form>
  );
}

interface FieldRowProps {
  label: string;
  name: string;
  invalid: boolean;
  error?: string;
  optional?: boolean;
  children: (props: {
    id: string;
    name: string;
    'aria-invalid': boolean;
    'aria-describedby': string | undefined;
  }) => React.ReactElement;
}

function FieldRow({ label, name, invalid, error, optional, children }: FieldRowProps) {
  const errorId = `${name}-error`;
  return (
    <div className="border-ink/12 grid grid-cols-[90px_minmax(0,1fr)] items-center gap-3 border-b px-5 py-2.5 max-[560px]:grid-cols-1 max-[560px]:items-start">
      <label htmlFor={name} className="text-muted font-mono text-[13px]">
        {label}
        {optional ? <span className="text-muted/70"> (optional)</span> : null}
      </label>
      <div className="flex flex-col gap-1">
        {children({
          id: name,
          name,
          'aria-invalid': invalid,
          'aria-describedby': error ? errorId : undefined,
        })}
        {error ? (
          <p id={errorId} className="text-destructive m-0 text-sm">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
