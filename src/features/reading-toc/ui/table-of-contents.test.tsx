import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TableOfContents } from './table-of-contents';

const items = [
  { id: 'day-1', value: 'Day 1 · Spec first' },
  { id: 'day-2', value: 'Day 2 · [Title]' },
];

describe('TableOfContents', () => {
  it('links to the heading anchors', () => {
    render(<TableOfContents items={items} activeId="day-1" />);
    const nav = screen.getByRole('navigation', { name: 'Contents' });
    const link = within(nav).getByRole('link', { name: /day 1/i });
    expect(link).toHaveAttribute('href', '#day-1');
    expect(link).toHaveAttribute('aria-current', 'location');
    expect(within(nav).getByRole('link', { name: /day 2/i })).not.toHaveAttribute('aria-current');
  });

  it('renders the desktop nav and the mobile toggle', () => {
    render(<TableOfContents items={items} />);
    expect(screen.getByRole('navigation', { name: 'Contents' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /contents/i })).toBeInTheDocument();
  });

  it('renders nothing without items', () => {
    const { container } = render(<TableOfContents items={[]} />);
    expect(container.querySelector('nav')).toBeNull();
    expect(screen.queryByRole('button', { name: /contents/i })).toBeNull();
  });
});
