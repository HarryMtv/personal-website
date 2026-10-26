import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useFocusWindowOnNavigate } from './use-focus-window-on-navigate';

type Listener = (event: { toLocation: unknown; fromLocation: unknown }) => void;

const listeners = new Set<Listener>();

vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({
    subscribe: (_: string, listener: Listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  }),
}));

function Probe() {
  useFocusWindowOnNavigate();
  return <div data-window="" tabIndex={-1} />;
}

function resolve() {
  listeners.forEach((listener) => listener({ toLocation: {}, fromLocation: {} }));
}

describe('useFocusWindowOnNavigate', () => {
  it('skips the first resolve (initial load)', () => {
    const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');
    render(<Probe />);
    resolve();
    expect(focusSpy).not.toHaveBeenCalled();
    focusSpy.mockRestore();
  });

  it('focuses the window on later navigations', () => {
    const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');
    render(<Probe />);
    resolve();
    resolve();
    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
    focusSpy.mockRestore();
  });
});
