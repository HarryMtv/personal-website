import { useCallback, useSyncExternalStore } from 'react';

function subscribe(query: string, onChange: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

/** Reactive CSS media query via useSyncExternalStore (SSR-safe). */
export function useMediaQuery(query: string): boolean {
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => false, []);
  return useSyncExternalStore(
    (onChange) => subscribe(query, onChange),
    getSnapshot,
    getServerSnapshot,
  );
}
