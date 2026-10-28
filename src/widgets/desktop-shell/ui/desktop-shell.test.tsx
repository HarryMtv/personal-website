import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithRouter } from '@/shared/lib/test/render-with-router';
import { DesktopShell } from './desktop-shell';

describe('DesktopShell', () => {
  it('renders both icon rails with their accessible names', async () => {
    await renderWithRouter(
      <DesktopShell>
        <p>window content</p>
      </DesktopShell>,
    );
    expect(screen.getByRole('navigation', { name: 'Desktop, left' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Desktop, right' })).toBeInTheDocument();
  });

  it('wraps the routed page in a labelled window slot', async () => {
    await renderWithRouter(
      <DesktopShell>
        <p>window content</p>
      </DesktopShell>,
    );
    const slot = screen.getByRole('region', { name: 'Window' });
    expect(slot).toHaveAttribute('id', 'window-slot');
    expect(slot).toHaveTextContent('window content');
  });

  it('shows the skip link first', async () => {
    await renderWithRouter(
      <DesktopShell>
        <p>content</p>
      </DesktopShell>,
    );
    expect(screen.getByRole('link', { name: 'Skip to window' })).toHaveAttribute(
      'href',
      '#window-slot',
    );
  });

  it('shows every desktop icon in the rails', async () => {
    await renderWithRouter(
      <DesktopShell>
        <p>content</p>
      </DesktopShell>,
    );
    const leftRail = screen.getByRole('navigation', { name: 'Desktop, left' });
    const rightRail = screen.getByRole('navigation', { name: 'Desktop, right' });
    for (const label of ['About me', 'Projects', 'Experience', 'Stack & uses', 'Writing']) {
      expect(within(leftRail).getByRole('link', { name: label })).toBeInTheDocument();
    }
    for (const label of ['Hobbies', 'Now', 'Contact', 'CV.pdf', 'Trash']) {
      expect(within(rightRail).getByRole('link', { name: label })).toBeInTheDocument();
    }
  });

  it('shows the 8-icon mobile grid', async () => {
    await renderWithRouter(
      <DesktopShell>
        <p>content</p>
      </DesktopShell>,
    );
    const grid = screen.getByRole('navigation', { name: 'Desktop' });
    expect(within(grid).getAllByRole('link')).toHaveLength(8);
  });
});
