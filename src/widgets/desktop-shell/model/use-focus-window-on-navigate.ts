import { useEffect, useRef } from 'react';
import { useRouter } from '@tanstack/react-router';

/**
 * Moves focus to the window ([data-window]) after every client-side
 * navigation, except the first resolve. `preventScroll` keeps the scroll
 * restoration in the router's hands.
 */
export function useFocusWindowOnNavigate() {
  const router = useRouter();
  const isFirstResolve = useRef(true);

  useEffect(() => {
    return router.subscribe('onResolved', () => {
      if (isFirstResolve.current) {
        isFirstResolve.current = false;
        return;
      }
      document.querySelector<HTMLElement>('[data-window]')?.focus({ preventScroll: true });
    });
  }, [router]);
}
