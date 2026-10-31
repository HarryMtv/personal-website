import { render, screen } from '@testing-library/react';
import { LazyMotion, MotionConfig, domMax } from 'motion/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { Screenshot } from './screenshot';

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
});
