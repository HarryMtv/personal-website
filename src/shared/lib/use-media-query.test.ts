import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useMediaQuery } from './use-media-query';

type Listener = () => void;

/** Installs a controllable window.matchMedia; returns a (query → set) control. */
function installMatchMedia(initial: Record<string, boolean>) {
  const state = new Map(Object.entries(initial));
  const listeners = new Map<string, Set<Listener>>();

  const impl = (query: string) =>
    ({
      matches: state.get(query) ?? false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: (_: string, listener: Listener) => {
        const set = listeners.get(query) ?? new Set<Listener>();
        set.add(listener);
        listeners.set(query, set);
      },
      removeEventListener: (_: string, listener: Listener) => {
        listeners.get(query)?.delete(listener);
      },
      dispatchEvent: vi.fn(),
    }) as unknown as MediaQueryList;

  vi.stubGlobal('matchMedia', impl);

  return {
    set(query: string, matches: boolean) {
      state.set(query, matches);
      act(() => {
        listeners.get(query)?.forEach((listener) => listener());
      });
    },
  };
}

describe('useMediaQuery', () => {
  it('returns whether the query currently matches', () => {
    installMatchMedia({ '(min-width: 900px)': true });
    const { result } = renderHook(() => useMediaQuery('(min-width: 900px)'));
    expect(result.current).toBe(true);
  });

  it('returns false when the query does not match', () => {
    installMatchMedia({});
    const { result } = renderHook(() => useMediaQuery('(prefers-reduced-motion: reduce)'));
    expect(result.current).toBe(false);
  });

  it('updates when the media state changes', () => {
    const controls = installMatchMedia({});
    const { result } = renderHook(() => useMediaQuery('(min-width: 900px)'));
    expect(result.current).toBe(false);
    controls.set('(min-width: 900px)', true);
    expect(result.current).toBe(true);
    controls.set('(min-width: 900px)', false);
    expect(result.current).toBe(false);
  });
});
