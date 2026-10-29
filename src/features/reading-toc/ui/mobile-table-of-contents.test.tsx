import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MobileTableOfContents } from './mobile-table-of-contents';

const items = [
  { id: 'day-1', value: 'Day 1 · Beginning' },
  { id: 'day-2', value: 'Day 2 · Adapters' },
];

function toggle() {
  return screen.getByRole('button', { name: /contents/i });
}

describe('MobileTableOfContents', () => {
  it('shows the label and the active section, collapsed', () => {
    render(<MobileTableOfContents items={items} activeId="day-2" />);
    expect(toggle()).toHaveTextContent('CONTENTS');
    expect(toggle()).toHaveTextContent('Day 2 · Adapters');
    expect(toggle()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation', { name: 'Contents' })).toBeNull();
  });

  it('falls back to the first section without an active id', () => {
    render(<MobileTableOfContents items={items} />);
    expect(toggle()).toHaveTextContent('Day 1 · Beginning');
  });

  it('opens a nav listing every section and marks the active one', async () => {
    const user = userEvent.setup();
    render(<MobileTableOfContents items={items} activeId="day-2" />);
    await user.click(toggle());

    expect(toggle()).toHaveAttribute('aria-expanded', 'true');
    const nav = screen.getByRole('navigation', { name: 'Contents' });
    expect(toggle()).toHaveAttribute('aria-controls', nav.id);

    const day1 = within(nav).getByRole('link', { name: /day 1/i });
    const day2 = within(nav).getByRole('link', { name: /day 2/i });
    expect(day1).toHaveAttribute('href', '#day-1');
    expect(day2).toHaveAttribute('href', '#day-2');
    expect(day2).toHaveAttribute('aria-current', 'location');
    expect(day1).not.toHaveAttribute('aria-current');
  });

  it('closes the list when a section is picked', async () => {
    const user = userEvent.setup();
    render(<MobileTableOfContents items={items} activeId="day-1" />);
    await user.click(toggle());
    const nav = screen.getByRole('navigation', { name: 'Contents' });
    await user.click(within(nav).getByRole('link', { name: /day 2/i }));

    expect(toggle()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation', { name: 'Contents' })).toBeNull();
  });

  it('closes on Escape without leaking the event to the document', async () => {
    const user = userEvent.setup();
    const onDocumentKeyDown = vi.fn();
    document.addEventListener('keydown', onDocumentKeyDown);
    try {
      render(<MobileTableOfContents items={items} activeId="day-1" />);
      await user.click(toggle());
      await user.keyboard('{Escape}');

      expect(screen.queryByRole('navigation', { name: 'Contents' })).toBeNull();
      expect(toggle()).toHaveAttribute('aria-expanded', 'false');
      expect(toggle()).toHaveFocus();
      expect(onDocumentKeyDown).not.toHaveBeenCalled();

      await user.keyboard('{Escape}');
      expect(onDocumentKeyDown).toHaveBeenCalledTimes(1);
    } finally {
      document.removeEventListener('keydown', onDocumentKeyDown);
    }
  });

  it('updates the shown section when the active id changes', () => {
    const { rerender } = render(<MobileTableOfContents items={items} activeId="day-1" />);
    expect(toggle()).toHaveTextContent('Day 1 · Beginning');
    rerender(<MobileTableOfContents items={items} activeId="day-2" />);
    expect(toggle()).toHaveTextContent('Day 2 · Adapters');
  });

  it('falls back to the first section when activeId does not match any item', () => {
    render(<MobileTableOfContents items={items} activeId="non-existent-section" />);
    expect(toggle()).toHaveTextContent('Day 1 · Beginning');
  });

  it('closes the dropdown when the toggle button is clicked a second time', async () => {
    const user = userEvent.setup();
    render(<MobileTableOfContents items={items} activeId="day-1" />);
    await user.click(toggle());
    expect(toggle()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('navigation', { name: 'Contents' })).toBeInTheDocument();

    await user.click(toggle());
    expect(toggle()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation', { name: 'Contents' })).toBeNull();
  });

  it('ignores non-Escape keys while open and lets them propagate', async () => {
    const user = userEvent.setup();
    const onDocumentKeyDown = vi.fn();
    document.addEventListener('keydown', onDocumentKeyDown);
    try {
      render(<MobileTableOfContents items={items} activeId="day-1" />);
      await user.click(toggle());
      await user.keyboard('{ArrowDown}');

      expect(toggle()).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('navigation', { name: 'Contents' })).toBeInTheDocument();
      expect(onDocumentKeyDown).toHaveBeenCalledTimes(1);
    } finally {
      document.removeEventListener('keydown', onDocumentKeyDown);
    }
  });
});
