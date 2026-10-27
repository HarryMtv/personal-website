import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithRouter } from '@/shared/lib/test/render-with-router';
import { Window } from './window';

describe('Window', () => {
  it('shows the mono title-bar path with the ~/igor/ prefix', async () => {
    await renderWithRouter(
      <Window path={[{ label: 'about.md' }]} closeTo="/desktop">
        <p>content</p>
      </Window>,
    );
    expect(screen.getByText('~/igor/')).toBeInTheDocument();
    expect(screen.getByText('about.md')).toBeInTheDocument();
  });

  it('renders path segments as links when they have a target', async () => {
    await renderWithRouter(
      <Window
        path={[{ label: 'projects/', to: '/projects' }, { label: 'README.md' }]}
        closeTo="/projects"
      >
        <p>content</p>
      </Window>,
    );
    expect(screen.getByRole('link', { name: 'projects/' })).toHaveAttribute('href', '/projects');
    expect(screen.getByText('README.md')).toBeInTheDocument();
  });

  it('closes via a labelled link to closeTo', async () => {
    await renderWithRouter(
      <Window path={[{ label: 'about.md' }]} closeTo="/desktop">
        <p>content</p>
      </Window>,
    );
    expect(screen.getByRole('link', { name: 'Close window' })).toHaveAttribute('href', '/desktop');
  });

  it('is labelled by its title bar and focusable', async () => {
    await renderWithRouter(
      <Window path={[{ label: 'uses.md' }]} closeTo="/desktop">
        <p>content</p>
      </Window>,
    );
    const article = document.querySelector('[data-window]')!;
    expect(article).toHaveAttribute('tabIndex', '-1');
    const labelledBy = article.getAttribute('aria-labelledby');
    expect(document.getElementById(labelledBy ?? '')).toHaveTextContent('uses.md');
  });

  it('shows meta and toolbar slots in the title bar', async () => {
    await renderWithRouter(
      <Window
        path={[{ label: 'writing/' }]}
        closeTo="/desktop"
        meta="4 items"
        toolbar={<button type="button">Zoom in</button>}
      >
        <p>content</p>
      </Window>,
    );
    expect(screen.getByText('4 items')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zoom in' })).toBeInTheDocument();
  });

  it('navigates to closeTo on Escape', async () => {
    const user = userEvent.setup();
    const { router } = await renderWithRouter(
      <Window path={[{ label: 'about.md' }]} closeTo="/desktop">
        <p>content</p>
      </Window>,
    );
    await user.keyboard('{Escape}');
    expect(router.state.location.pathname).toBe('/desktop');
  });

  it('is not draggable when the viewport is small or motion is reduced', async () => {
    await renderWithRouter(
      <Window path={[{ label: 'about.md' }]} closeTo="/desktop">
        <p>content</p>
      </Window>,
    );
    // The default matchMedia stub matches nothing.
    expect(document.querySelector('[data-window]')).toHaveAttribute('data-draggable', 'false');
  });

  it('is not draggable under prefers-reduced-motion, even on a desk viewport', async () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
    try {
      await renderWithRouter(
        <Window path={[{ label: 'about.md' }]} closeTo="/desktop">
          <p>content</p>
        </Window>,
      );
      expect(document.querySelector('[data-window]')).toHaveAttribute('data-draggable', 'false');
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
