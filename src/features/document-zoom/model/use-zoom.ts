import { useCallback, useState } from 'react';

export interface ZoomOptions {
  min?: number;
  max?: number;
  step?: number;
  initial?: number;
}

/** Bounded stepper for the CV zoom, in percent. */
export function useZoom({ min = 50, max = 150, step = 10, initial = 100 }: ZoomOptions = {}) {
  const [zoom, setZoom] = useState(initial);

  const clamp = useCallback((value: number) => Math.min(max, Math.max(min, value)), [min, max]);

  const zoomIn = useCallback(() => setZoom((z) => clamp(z + step)), [clamp, step]);
  const zoomOut = useCallback(() => setZoom((z) => clamp(z - step)), [clamp, step]);

  return {
    zoom,
    zoomIn,
    zoomOut,
    canZoomIn: zoom + step <= max,
    canZoomOut: zoom - step >= min,
  };
}
