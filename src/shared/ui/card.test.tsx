import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './card';

describe('Card', () => {
  it('renders its children in a card', () => {
    render(<Card>Right now</Card>);
    expect(screen.getByText('Right now')).toBeInTheDocument();
  });

  it('adds the elevated shadow only when requested', () => {
    const { rerender } = render(<Card data-testid="plain">x</Card>);
    expect(screen.getByTestId('plain')).not.toHaveClass('shadow-[0_10px_30px_rgb(30_27_24/0.08)]');
    rerender(
      <Card data-testid="plain" elevated>
        x
      </Card>,
    );
    expect(screen.getByTestId('plain')).toHaveClass('bg-card', 'rounded-card');
  });
});
