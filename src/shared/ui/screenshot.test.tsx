import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LazyMotion, MotionConfig, domMax } from 'motion/react';
import type { ReactNode } from 'react';
import { beforeAll, describe, expect, it } from 'vitest';
import { Screenshot } from './screenshot';

beforeAll(() => {
  // happy-dom's partial Web Animations API rejects `finished` with AbortError
  // whenever motion cancels an animation on unmount, which Vitest reports as
  // an unhandled rejection. Drop `animate` so motion drives the fades from
  // its own frame loop, where cancelling is a plain synchronous stop.
  delete (Element.prototype as { animate?: unknown }).animate;
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
});
