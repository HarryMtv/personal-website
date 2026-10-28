import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithRouter } from '@/shared/lib/test/render-with-router';
import { MenuBar } from './menu-bar';

describe('MenuBar', () => {
  it('links the monogram home', async () => {
    await renderWithRouter(<MenuBar />);
    expect(screen.getByRole('link', { name: /igor martynov/i })).toHaveAttribute('href', '/');
  });

  it('shows the main nav with the four sections', async () => {
    await renderWithRouter(<MenuBar />);
    const nav = screen.getByRole('navigation', { name: 'Main' });
    for (const label of ['Projects', 'Experience', 'Writing', 'Hobbies']) {
      expect(nav).toHaveTextContent(label);
    }
  });

  it('shows the live Prague clock', async () => {
    await renderWithRouter(<MenuBar />);
    // The placeholder "--:--" shows only before the first tick, so accept both.
    expect(screen.getByText(/Praha · (--:--|\d{1,2}:\d{2})/)).toBeInTheDocument();
  });

  it('offers the Say hello CTA to /contact', async () => {
    await renderWithRouter(<MenuBar />);
    expect(screen.getByRole('link', { name: /say hello/i })).toHaveAttribute('href', '/contact');
  });
});
