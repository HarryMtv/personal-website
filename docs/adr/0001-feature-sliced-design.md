# ADR 0001: Feature-Sliced Design with machine-enforced boundaries

- **Status:** Accepted
- **Date:** 2026-10-27

## Context

The site is small, but the repository doubles as a showcase for architects
evaluating how structure scales. The template shipped a flat layout
(`src/components`, `src/features/example`, `src/routes`) with no coupling
rules — fine for a demo, silent entropy for anything longer-lived.

## Decision

Adopt [Feature-Sliced Design](https://feature-sliced.design/) with the layers
`app → pages → widgets → features → entities → shared`, and enforce it in CI
with [dependency-cruiser](https://github.com/sverweij/dependency-cruiser)
(`pnpm lint:boundaries`):

1. **Layer order** — a layer may only import from layers strictly below it.
2. **Slice isolation** — slices in the `pages|widgets|features|entities`
   layers never import each other.
3. **Public API** — imports across layers must target a slice's `index.ts`.
4. **Content quarantine** — `content/` is reachable only from
   `entities/*/api/**`, where zod validates it before anyone else sees it.
5. **No cycles, no orphans** (orphans as warnings).

Every rule was proven against a deliberate violation before landing.

## Consequences

- The URL is the window manager: one route per window, so deep links,
  back/forward, per-page titles and code-splitting come free (see ADR 0004).
- State ownership stays boring: URL for explorer filters, TanStack Query for
  the contact mutation, Zustand only for the sessionStorage draft, local
  state for the clock and zoom.
- Adding a feature means creating a slice with an `index.ts` and wiring one
  thin route — boundaries keep it from sprawling.
- `pnpm deps:graph` regenerates the dependency graph for the docs.

## Alternatives considered

- **steiger** (the official FSD linter) — checks FSD conventions but not the
  extra content-quarantine rule, and does not produce a graph.
- **A single-page window manager in Zustand** (as the design mock prototypes)
  — loses deep links, history and per-page titles.
