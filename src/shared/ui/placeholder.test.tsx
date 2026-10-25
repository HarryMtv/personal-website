import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Placeholder } from './placeholder';

describe('Placeholder', () => {
  it('renders the dashed box with a caption', () => {
    render(<Placeholder caption="PM Telegram Hub — chat list" />);
    expect(screen.getByText('PM Telegram Hub — chat list')).toBeInTheDocument();
    expect(screen.getByText('screenshot')).toBeInTheDocument();
  });

  it('applies the aspect ratio', () => {
    render(<Placeholder ratio="16/9" caption="x" />);
    expect(screen.getByText('screenshot')).toHaveStyle({ aspectRatio: '16/9' });
  });

  it('omits the caption element when no caption is given', () => {
    const { container } = render(<Placeholder />);
    expect(container.querySelector('p')).toBeNull();
  });
});
