# ADR 0003: Contact form as ports and adapters

- **Status:** Accepted
- **Date:** 2026-10-27

## Context

The contact form must work in every deployment — including this repo's
static hosting with no backend — without a code fork, and tests must never
POST to a real provider.

## Decision

`features/send-contact-message` defines a `ContactTransport` port
(`send(msg): Promise<void>`) with two adapters:

- **web3forms** — POSTs JSON to `VITE_CONTACT_ENDPOINT` with
  `VITE_CONTACT_ACCESS_KEY` when the endpoint is configured;
- **mailto** — opens a prefilled `mailto:` URL otherwise (and serves as the
  error-state fallback).

`resolveContactTransport(env)` picks once at startup; the form talks only to
the port, and tests inject fake transports.

**Spam posture:** the Web3Forms access key is _public by design_ — it can only
be used to submit the form. The hidden `botcheck` honeypot (rejected by the
zod schema) filters naive bots, and Web3Forms' dashboard can restrict the key
to the site's domain. The known limitation: a determined actor can still POST
directly; that is the trade for a backendless form.

## Consequences

- The static build works out of the box (mailto mode) and upgrades to email
  delivery by setting two env vars — including as Docker build ARGs.
- Failure UX is honest: inline alert, Try again, and a prefilled mailto link.
- The honeypot field is mirrored into the persisted draft so a bot's input
  survives navigation and still fails validation on submit.

## Alternatives considered

- **A serverless function per deploy target** — real backend, out of scope.
- **No form, mailto only** — loses validation, drafts and the success state.
