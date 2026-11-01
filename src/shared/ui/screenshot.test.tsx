import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LazyMotion, MotionConfig, domMax } from 'motion/react';
import type { ReactNode } from 'react';
import { beforeAll, afterEach, describe, expect, it, vi } from 'vitest';
import { useEscapeToClose } from '@/shared/lib/use-escape-to-close';
import { Screenshot } from './screenshot';

afterEach(() => {
  vi.restoreAllMocks();
});

beforeAll(() => {
  // happy-dom's partial Web Animations API rejects `finished` with AbortError
  // whenever motion cancels an animation on unmount, which Vitest reports as
  // an unhandled rejection. Drop `animate` so motion drives the fades from
  // its own frame loop, where cancelling is a plain synchronous stop.
  delete (Element.prototype as { animate?: unknown }).animate;
  // It also lays out nothing — every rect is 0×0 — and motion's shared-layout
  // projection never completes a handoff exit in that degenerate case, so the
  // lightbox would never unmount. Give every element a fixed measurable box.
  Element.prototype.getBoundingClientRect = () => ({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 100,
    bottom: 56,
    width: 100,
    height: 56,
    toJSON: () => ({}),
  });
});

// The app mounts components inside LazyMotion/MotionConfig (see app-providers);
// tests mirror that so `m.*` renders and AnimatePresence exits settle quickly.
function mount(ui: ReactNode) {
  return render(
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="always">{ui}</MotionConfig>
    </LazyMotion>,
  );
}

describe('Screenshot', () => {
  it('names the figure by its caption', () => {
    mount(<Screenshot src="/shot.png" width={1024} height={572} caption="The mini app" />);
    expect(screen.getByRole('figure', { name: 'The mini app' })).toBeInTheDocument();
  });

  it('falls back to a generic name without a caption', () => {
    mount(<Screenshot src="/shot.png" width={1024} height={572} />);
    expect(screen.getByRole('figure', { name: 'Screenshot' })).toBeInTheDocument();
  });

  it('reserves the image box with its intrinsic size', () => {
    const { container } = mount(<Screenshot src="/shot.png" width={1024} height={572} />);
    const image = container.querySelector('img');
    expect(image).toHaveAttribute('src', '/shot.png');
    expect(image).toHaveAttribute('width', '1024');
    expect(image).toHaveAttribute('height', '572');
  });

  it('wraps the thumbnail in a button that announces the lightbox', () => {
    const { container } = mount(
      <Screenshot src="/shot.png" width={1024} height={572} caption="The mini app" />,
    );
    const trigger = screen.getByRole('button', { name: 'Open full-size screenshot' });
    expect(trigger).toHaveAttribute('type', 'button');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    const image = container.querySelector('img');
    expect(image).toBeInTheDocument();
    expect(trigger).toContainElement(image);
  });

  it('opens the lightbox named by the caption with the full-size image on click', async () => {
    const user = userEvent.setup();
    mount(<Screenshot src="/shot.png" width={1024} height={572} caption="The mini app" />);
    await user.click(screen.getByRole('button', { name: 'Open full-size screenshot' }));
    const dialog = screen.getByRole('dialog', { name: 'The mini app' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    const image = dialog.querySelector('img');
    expect(image).toHaveAttribute('src', '/shot.png');
  });

  it('opens the lightbox with the Enter key', async () => {
    const user = userEvent.setup();
    mount(<Screenshot src="/shot.png" width={1024} height={572} />);
    screen.getByRole('button', { name: 'Open full-size screenshot' }).focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('dialog', { name: 'Screenshot' })).toBeInTheDocument();
  });

  it('closes the lightbox from the close button', async () => {
    const user = userEvent.setup();
    mount(<Screenshot src="/shot.png" width={1024} height={572} caption="The mini app" />);
    await user.click(screen.getByRole('button', { name: 'Open full-size screenshot' }));
    await user.click(screen.getByRole('button', { name: 'Close screenshot' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('closes the lightbox on a backdrop click', async () => {
    const user = userEvent.setup();
    mount(<Screenshot src="/shot.png" width={1024} height={572} />);
    await user.click(screen.getByRole('button', { name: 'Open full-size screenshot' }));
    await user.click(screen.getByRole('dialog'));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('closes the lightbox on Escape', async () => {
    const user = userEvent.setup();
    mount(<Screenshot src="/shot.png" width={1024} height={572} />);
    await user.click(screen.getByRole('button', { name: 'Open full-size screenshot' }));
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('keeps Escape to the lightbox while open, then hands it back to the window', async () => {
    const onWindowClose = vi.fn();
    function WindowStub() {
      useEscapeToClose(onWindowClose);
      return <Screenshot src="/shot.png" width={1024} height={572} />;
    }
    const user = userEvent.setup();
    mount(<WindowStub />);
    await user.click(screen.getByRole('button', { name: 'Open full-size screenshot' }));
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(onWindowClose).not.toHaveBeenCalled();
    await user.keyboard('{Escape}');
    expect(onWindowClose).toHaveBeenCalledTimes(1);
  });

  it('focuses the close button on open and keeps Tab on it', async () => {
    const user = userEvent.setup();
    mount(<Screenshot src="/shot.png" width={1024} height={572} />);
    const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');
    await user.click(screen.getByRole('button', { name: 'Open full-size screenshot' }));
    const close = screen.getByRole('button', { name: 'Close screenshot' });
    expect(document.activeElement).toBe(close);
    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
    await user.keyboard('{Tab}');
    expect(document.activeElement).toBe(close);
    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(document.activeElement).toBe(close);
  });

  it('returns focus to the trigger on close without scrolling', async () => {
    const user = userEvent.setup();
    mount(<Screenshot src="/shot.png" width={1024} height={572} />);
    const trigger = screen.getByRole('button', { name: 'Open full-size screenshot' });
    await user.click(trigger);
    const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');
    await user.click(screen.getByRole('button', { name: 'Close screenshot' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(document.activeElement).toBe(trigger);
    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('locks the page scroll while open and restores it on close', async () => {
    const user = userEvent.setup();
    // innerWidth defaults to 1024 in happy-dom; a narrower clientWidth fakes
    // a classic scrollbar the lock has to compensate for on the body.
    Object.defineProperty(document.documentElement, 'clientWidth', {
      configurable: true,
      value: 984,
    });
    try {
      mount(<Screenshot src="/shot.png" width={1024} height={572} />);
      await user.click(screen.getByRole('button', { name: 'Open full-size screenshot' }));
      expect(document.documentElement.style.overflow).toBe('hidden');
      expect(document.body.style.paddingRight).toBe('40px');
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      expect(document.documentElement.style.overflow).toBe('');
      expect(document.body.style.paddingRight).toBe('');
    } finally {
      Reflect.deleteProperty(document.documentElement, 'clientWidth');
    }
  });

  it('returns the page to the saved scroll offset on close', async () => {
    const user = userEvent.setup();
    Object.defineProperty(window, 'scrollX', { configurable: true, value: 12 });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 640 });
    const scrollTo = vi.spyOn(window, 'scrollTo');
    try {
      mount(<Screenshot src="/shot.png" width={1024} height={572} />);
      await user.click(screen.getByRole('button', { name: 'Open full-size screenshot' }));
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      expect(scrollTo).toHaveBeenCalledWith({ left: 12, top: 640, behavior: 'instant' });
    } finally {
      Reflect.deleteProperty(window, 'scrollX');
      Reflect.deleteProperty(window, 'scrollY');
    }
  });

  it('holds the thumbnail slot with an aspect-ratio spacer while open', async () => {
    const user = userEvent.setup();
    mount(<Screenshot src="/shot.png" width={1024} height={572} />);
    const trigger = screen.getByRole('button', { name: 'Open full-size screenshot' });
    await user.click(trigger);
    expect(trigger.querySelector('img')).not.toBeInTheDocument();
    const spacer = trigger.querySelector('span');
    expect(spacer).toHaveAttribute('aria-hidden', 'true');
    expect(spacer?.style.aspectRatio).toBe('1024 / 572');
  });

  it('opens the lightbox with the Space key', async () => {
    const user = userEvent.setup();
    mount(<Screenshot src="/shot.png" width={1024} height={572} caption="The mini app" />);
    screen.getByRole('button', { name: 'Open full-size screenshot' }).focus();
    await user.keyboard(' ');
    expect(screen.getByRole('dialog', { name: 'The mini app' })).toBeInTheDocument();
  });

  it('closes the lightbox when clicking the zoomed image', async () => {
    const user = userEvent.setup();
    mount(<Screenshot src="/shot.png" width={1024} height={572} caption="The mini app" />);
    await user.click(screen.getByRole('button', { name: 'Open full-size screenshot' }));
    const dialog = screen.getByRole('dialog', { name: 'The mini app' });
    const zoomedImage = dialog.querySelector('img');
    expect(zoomedImage).not.toBeNull();
    await user.click(zoomedImage!);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('preserves pre-existing inline overflow and paddingRight when there is no scrollbar', async () => {
    const user = userEvent.setup();
    document.documentElement.style.overflow = 'clip';
    document.body.style.paddingRight = '12px';
    Object.defineProperty(document.documentElement, 'clientWidth', {
      configurable: true,
      value: window.innerWidth,
    });
    try {
      mount(<Screenshot src="/shot.png" width={1024} height={572} />);
      await user.click(screen.getByRole('button', { name: 'Open full-size screenshot' }));
      expect(document.documentElement.style.overflow).toBe('hidden');
      expect(document.body.style.paddingRight).toBe('12px');
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      expect(document.documentElement.style.overflow).toBe('clip');
      expect(document.body.style.paddingRight).toBe('12px');
    } finally {
      document.documentElement.style.overflow = '';
      document.body.style.paddingRight = '';
      Reflect.deleteProperty(document.documentElement, 'clientWidth');
    }
  });

  it('restores scroll lock if Screenshot unmounts while the lightbox is open', async () => {
    const user = userEvent.setup();
    const { unmount } = mount(<Screenshot src="/shot.png" width={1024} height={572} />);
    await user.click(screen.getByRole('button', { name: 'Open full-size screenshot' }));
    expect(document.documentElement.style.overflow).toBe('hidden');
    unmount();
    expect(document.documentElement.style.overflow).toBe('');
  });
});
