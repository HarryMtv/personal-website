import { Minus, Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface ZoomControlsProps {
  zoom: number;
  canZoomIn: boolean;
  canZoomOut: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

/** Zoom out [−] / readout / zoom in [+] controls for the CV toolbar. */
export function ZoomControls({
  zoom,
  canZoomIn,
  canZoomOut,
  onZoomIn,
  onZoomOut,
}: ZoomControlsProps) {
  return (
    <div className="flex items-center gap-1" data-slot="zoom-controls">
      <Button
        variant="window"
        size="icon"
        aria-label="Zoom out"
        disabled={!canZoomOut}
        onClick={onZoomOut}
      >
        <Minus size={16} strokeWidth={2} aria-hidden="true" />
      </Button>
      <output aria-live="polite" className="text-ink-2 w-12 text-center font-mono text-xs">
        {zoom}%
      </output>
      <Button
        variant="window"
        size="icon"
        aria-label="Zoom in"
        disabled={!canZoomIn}
        onClick={onZoomIn}
      >
        <Plus size={16} strokeWidth={2} aria-hidden="true" />
      </Button>
    </div>
  );
}
