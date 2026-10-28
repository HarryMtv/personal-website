import { useEffect, useRef } from 'react';
import { useRouter } from '@tanstack/react-router';

/**
 * Moves focus to the window ([data-window]) after every client-side
 * navigation that changes the path, except the first resolve. Search-only
 * updates (project filters, row selection) keep focus where the user left
 * it. `preventScroll` keeps the scroll restoration in the router's hands.
 */
export function useFocusWindowOnNavigate() {
  const router = useRouter();
  const isFirstResolve = useRef(true);

  useEffect(() => {
    return router.subscribe('onResolved', (event) => {
      if (isFirstResolve.current) {
        isFirstResolve.current = false;
        return;
      }
      if (!event.pathChanged) return;
      document.querySelector<HTMLElement>('[data-window]')?.focus({ preventScroll: true });
    });
  }, [router]);
}
