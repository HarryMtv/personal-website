import { useEffect, useState } from 'react';

/**
 * Tracks which section is in view via IntersectionObserver. The first id is
 * active until something else intersects. TOC clicks (hash navigation) set
 * the active section directly — the last section can end below the observer
 * zone when the page cannot scroll further.
 */
export function useScrollSpy(ids: string[], rootMargin = '0px 0px -60% 0px'): string | undefined {
  const [activeId, setActiveId] = useState<string | undefined>(ids[0]);
  // A fresh-but-equal array (e.g. `toc.map(...)` on every render) must not
  // re-subscribe the observer, so the effect keys on the joined ids rather
  // than the array identity.
  const idsKey = ids.join('|');

  useEffect(() => {
    const sectionIds = idsKey === '' ? [] : idsKey.split('|');
    if (sectionIds.length === 0) return;

    const syncFromHash = () => {
      const id = window.location.hash.slice(1);
      if (id && sectionIds.includes(id)) setActiveId(id);
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return () => window.removeEventListener('hashchange', syncFromHash);

    const observer = new IntersectionObserver(
      (entries) => {
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
    };
  }, [idsKey, rootMargin]);

  return activeId;
}
