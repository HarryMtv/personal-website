# ADR 0004: View Transitions for the window swap, Motion for gestures

- **Status:** Accepted
- **Date:** 2026-10-27

## Context

The "desktop OS" metaphor lives or dies on the window feeling like a window:
opening, closing and dragging should be tactile, while staying cheap on the
main bundle and silent under `prefers-reduced-motion`.

## Decision

- **Route changes** use the View Transitions API via TanStack Router's
  `defaultViewTransition: true`. The window carries
  `view-transition-name: window` (the `.window` class); the swap animates
  with small custom keyframes in `src/app/styles/index.css`. Browsers without
  the API get an instant swap — no JS fallback to maintain.
- **Gestures and micro-motion** use Motion (`motion/react`) behind
  `LazyMotion features={domMax} strict` + `MotionConfig
reducedMotion="user"`: icon hover/tap, the first-load stagger, list
  staggers, the sticky-note spring, the `layoutId` selection pill, the
  contact success swap, and title-bar drag constrained to the desk.
- **Drag** is enabled only ≥900px with motion allowed — `data-draggable`
  reflects the computed state and is asserted in tests.

## Consequences

- The main chunk stays ~121 KB gzip (Motion included, routes code-split) — under the 200 KB
  budget; `strict` bans accidental full-`motion` imports.
- Reduced-motion users get no transforms, no drag and instant route swaps
  from one CSS media query.
- Known quirk: a dragged window's inline transform participates in the
  view-transition snapshot, so the outgoing window animates from the dragged
  spot. Acceptable; resetting drag position pre-navigation is the escape
  hatch if it ever looks wrong.

## Alternatives considered

- **Motion for route transitions too** — more JS for something the platform
  now does natively.
- **FLIP by hand** — reimplementing layoutId badly.
