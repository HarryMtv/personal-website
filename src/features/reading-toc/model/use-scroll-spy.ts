import { useEffect, useRef, useState } from 'react';

/** Keys with which the reader moves the page themselves. */
const SCROLL_INTENT_KEYS = new Set([
  'PageUp',
  'PageDown',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
  ' ',
  'Spacebar',
]);

/**
 * Tracks which section is in view via IntersectionObserver. The first id is
 * active until something else intersects. TOC clicks (hash navigation) pin
 * the active section: the observer would otherwise overwrite the choice on
 * the frame after the programmatic jump — a section at the very bottom of
 * the page can never reach the top zone. The pin lifts on the reader's own
 * scroll intent (wheel, touch, paging keys), and at the document bottom the
 * last section wins for the same reason.
 */
export function useScrollSpy(ids: string[], rootMargin = '0px 0px -60% 0px'): string | undefined {
  const [activeId, setActiveId] = useState<string | undefined>(ids[0]);
  // The id chosen by the last hash navigation; observer updates are ignored
  // while it is set.
  const pinnedIdRef = useRef<string | undefined>(undefined);
  // A fresh-but-equal array (e.g. `toc.map(...)` on every render) must not
  // re-subscribe the observer, so the effect keys on the joined ids rather
  // than the array identity.
  const idsKey = ids.join('|');

  useEffect(() => {
    const sectionIds = idsKey === '' ? [] : idsKey.split('|');
    if (sectionIds.length === 0) return;
    // A pin from a previous page (same route, new content) is stale here.
    pinnedIdRef.current = undefined;

    const syncFromHash = () => {
      const id = window.location.hash.slice(1);
      if (id && sectionIds.includes(id)) {
        pinnedIdRef.current = id;
        setActiveId(id);
      }
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);

    const clearPin = () => {
      pinnedIdRef.current = undefined;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (SCROLL_INTENT_KEYS.has(event.key)) clearPin();
    };
    window.addEventListener('wheel', clearPin, { passive: true });
    window.addEventListener('touchmove', clearPin, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) {
      return () => {
        window.removeEventListener('hashchange', syncFromHash);
        window.removeEventListener('wheel', clearPin);
        window.removeEventListener('touchmove', clearPin);
        window.removeEventListener('keydown', onKeyDown);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (pinnedIdRef.current) return;
        // The last section can never cross the top zone once the document
        // bottom stops it, so it wins whenever the page rests at the bottom.
        const scrollable = document.documentElement.scrollHeight > window.innerHeight;
        const atBottom =
          scrollable &&
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
        if (atBottom) {
          setActiveId(sectionIds[sectionIds.length - 1]);
          return;
        }
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin },
    );
    elements.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', syncFromHash);
      window.removeEventListener('wheel', clearPin);
      window.removeEventListener('touchmove', clearPin);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [idsKey, rootMargin]);

  return activeId;
}
