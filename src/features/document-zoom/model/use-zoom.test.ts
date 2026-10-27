import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useZoom } from './use-zoom';

describe('useZoom', () => {
  it('starts at 100% and steps by 10', () => {
    const { result } = renderHook(() => useZoom());
    expect(result.current.zoom).toBe(100);
    act(() => result.current.zoomIn());
    expect(result.current.zoom).toBe(110);
    act(() => result.current.zoomOut());
    expect(result.current.zoom).toBe(100);
  });

  it('stops at the bounds', () => {
    const { result } = renderHook(() => useZoom());
    for (let i = 0; i < 20; i++) act(() => result.current.zoomIn());
    expect(result.current.zoom).toBe(150);
    expect(result.current.canZoomIn).toBe(false);
    for (let i = 0; i < 30; i++) act(() => result.current.zoomOut());
    expect(result.current.zoom).toBe(50);
    expect(result.current.canZoomOut).toBe(false);
  });

  it('honours custom options', () => {
    const { result } = renderHook(() => useZoom({ min: 50, max: 150, step: 10, initial: 150 }));
    expect(result.current.zoom).toBe(150);
    expect(result.current.canZoomIn).toBe(false);
    expect(result.current.canZoomOut).toBe(true);
  });
});
