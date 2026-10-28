import { useEffect, useRef } from 'react';

const EDITABLE_SELECTOR = 'input, textarea, select, [contenteditable]';

/**
 * Calls `onClose` when Escape is pressed anywhere on the document, unless
 * focus sits in an editable field where Escape belongs to the field. The
 * listener subscribes once; a ref keeps the latest callback.
 */
export function useEscapeToClose(onClose: () => void) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const target = event.target;
      if (target instanceof HTMLElement && target.closest(EDITABLE_SELECTOR)) return;
      onCloseRef.current();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);
}
