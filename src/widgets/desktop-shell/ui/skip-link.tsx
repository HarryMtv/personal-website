/** "Skip to window" — the first focusable element on every page. */
export function SkipLink() {
  return (
    <a
      href="#window-slot"
      className="sr-only rounded-cta bg-ink px-4 py-2 text-sm font-semibold text-paper focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50"
    >
      Skip to window
    </a>
  );
}
