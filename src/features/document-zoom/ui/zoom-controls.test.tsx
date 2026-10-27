import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ZoomControls } from './zoom-controls';

function mount(props: Partial<Parameters<typeof ZoomControls>[0]> = {}) {
  return render(
    <ZoomControls
      zoom={100}
      canZoomIn
      canZoomOut
      onZoomIn={vi.fn()}
      onZoomOut={vi.fn()}
      {...props}
    />,
  );
}

describe('ZoomControls', () => {
  it('shows the current percentage politely', () => {
    mount({ zoom: 130 });
    expect(screen.getByText('130%')).toHaveAttribute('aria-live', 'polite');
  });

  it('disables each button at its bound', () => {
    mount({ canZoomIn: false });
    expect(screen.getByRole('button', { name: 'Zoom in' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Zoom out' })).toBeEnabled();
  });

  it('fires the handlers', async () => {
    const onZoomIn = vi.fn();
    const onZoomOut = vi.fn();
    const user = userEvent.setup();
    mount({ onZoomIn, onZoomOut });
    await user.click(screen.getByRole('button', { name: 'Zoom in' }));
    await user.click(screen.getByRole('button', { name: 'Zoom out' }));
    expect(onZoomIn).toHaveBeenCalledTimes(1);
    expect(onZoomOut).toHaveBeenCalledTimes(1);
  });
});
