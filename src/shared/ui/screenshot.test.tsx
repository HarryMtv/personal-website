import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Screenshot } from './screenshot';

describe('Screenshot', () => {
  it('names the figure by its caption', () => {
    render(<Screenshot src="/shot.png" width={1024} height={572} caption="The mini app" />);
    expect(screen.getByRole('figure', { name: 'The mini app' })).toBeInTheDocument();
  });

  it('falls back to a generic name without a caption', () => {
    render(<Screenshot src="/shot.png" width={1024} height={572} />);
    expect(screen.getByRole('figure', { name: 'Screenshot' })).toBeInTheDocument();
  });

  it('reserves the image box with its intrinsic size', () => {
    const { container } = render(<Screenshot src="/shot.png" width={1024} height={572} />);
    const image = container.querySelector('img');
    expect(image).toHaveAttribute('src', '/shot.png');
    expect(image).toHaveAttribute('width', '1024');
    expect(image).toHaveAttribute('height', '572');
  });
});
