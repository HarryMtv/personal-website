import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useEscapeToClose } from './use-escape-to-close';

function Probe({ onClose }: { onClose: () => void }) {
  useEscapeToClose(onClose);
  return (
    <div>
      <button type="button">outside</button>
      <input placeholder="editable" />
    </div>
  );
}

describe('useEscapeToClose', () => {
  it('fires on Escape outside editable elements', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Probe onClose={onClose} />);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('ignores Escape while typing in an input', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Probe onClose={onClose} />);
    await user.click(screenInput());
    await user.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('stops listening after unmount', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const { unmount } = render(<Probe onClose={onClose} />);
    unmount();
    await user.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
  });
});

function screenInput() {
  return document.querySelector('input')!;
}
