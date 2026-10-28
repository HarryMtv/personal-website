import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { usePragueClock } from './use-prague-clock';

describe('usePragueClock', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it('ticks immediately on mount with a Prague time', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-25T23:05:00Z'));
    const { result } = renderHook(() => usePragueClock());
    act(() => {
      vi.runAllTicks();
    });
    // The placeholder '--:--' only exists before the first effect tick;
    // once mounted the hook always has a real Prague time.
    expect(result.current).not.toBe('--:--');
    expect(result.current).toMatch(/^\d{1,2}:\d{2}$/);
  });

  it('formats the Europe/Prague time zone, not the local one', () => {
    vi.useFakeTimers();
    // 23:05 UTC on a summer date is 01:05 the next day in Prague (CEST).
    vi.setSystemTime(new Date('2026-07-15T23:05:00Z'));
    const { result } = renderHook(() => usePragueClock());
    act(() => {
      vi.runAllTicks();
    });
    expect(result.current).toBe('01:05');
  });

  it('refreshes every 30 seconds and stops on unmount', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-25T23:00:00Z'));
    const { result, unmount } = renderHook(() => usePragueClock());
    act(() => {
      vi.runAllTicks();
    });
    const first = result.current;

    act(() => {
      vi.setSystemTime(new Date('2026-10-25T23:31:00Z'));
      vi.advanceTimersByTime(30_000);
    });
    expect(result.current).not.toBe(first);

    const clearSpy = vi.spyOn(window, 'clearInterval');
    unmount();
    expect(clearSpy).toHaveBeenCalled();
  });
});
