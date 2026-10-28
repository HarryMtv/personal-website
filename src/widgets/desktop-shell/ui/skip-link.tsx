/** "Skip to window" — the first focusable element on every page. */
export function SkipLink() {
  return (
    <a
      href="#window-slot"
      className="rounded-cta bg-ink text-paper sr-only px-4 py-2 text-sm font-semibold focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50"
    >
      Skip to window
    </a>
  );
}
