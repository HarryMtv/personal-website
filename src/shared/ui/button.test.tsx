import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('mounts to the DOM with the right element and children', () => {
    // Direct DOM assertion. If the test environment ever silently fails to
    // commit a render (the container is left empty), getByRole below would fail
    // with a misleading "element not found" — this assertion pins the failure
    // to the render itself.
    const { container } = render(<Button>Mounted</Button>);
    expect(container.innerHTML).not.toBe('');
    const button = container.querySelector('button[data-slot="button"]');
    expect(button).not.toBeNull();
    expect(button).toHaveTextContent('Mounted');
  });

  it('renders its children as a button', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies the primary variant by default', () => {
    render(<Button>Send</Button>);
    expect(screen.getByRole('button', { name: /send/i })).toHaveClass('bg-amber');
  });

  it('applies variant classes', () => {
    render(<Button variant="secondary">Download</Button>);
    expect(screen.getByRole('button', { name: /download/i })).toHaveClass('bg-white');
    render(<Button variant="menu">Projects</Button>);
    expect(screen.getByRole('button', { name: /projects/i })).toHaveClass('text-sm');
    render(<Button variant="window" aria-label="Close window" />);
    expect(screen.getByRole('button', { name: 'Close window' })).toHaveClass('size-[30px]');
  });

  it('applies size classes', () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button', { name: /small/i })).toHaveClass('min-h-9');
  });

  it('renders as an anchor with asChild', () => {
    render(
      <Button asChild>
        <a href="/projects">See my projects</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: /see my projects/i });
    expect(link).toHaveAttribute('href', '/projects');
    expect(link).toHaveClass('bg-amber');
  });
});
