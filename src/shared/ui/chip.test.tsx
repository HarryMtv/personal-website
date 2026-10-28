import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Chip } from './chip';

describe('Chip', () => {
  it('renders its content as a chip', () => {
    render(<Chip>TypeScript</Chip>);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('merges custom classes', () => {
    render(<Chip className="text-tag-green">AI</Chip>);
    expect(screen.getByText('AI')).toHaveClass('text-tag-green', 'bg-paper-2');
  });
});
