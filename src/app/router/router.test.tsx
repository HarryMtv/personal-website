import { act, render, screen, within } from '@testing-library/react';
import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router';
import { describe, expect, it } from 'vitest';
import { ErrorPage } from '@/pages/error';
import { NotFoundPage } from '@/pages/not-found';
import { routeTree } from '../routeTree.gen';

/** Renders the real route tree over a memory history at the given path. */
async function renderApp(path: string) {
  const testRouter = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
    defaultPreload: 'intent',
    defaultNotFoundComponent: NotFoundPage,
    defaultErrorComponent: ErrorPage,
  });
  // Route components are code-split; load the initial location before rendering.
  await testRouter.load();
  const rendered = render(<RouterProvider router={testRouter} />);
  await act(async () => {
    await Promise.resolve();
  });
  return { ...rendered, router: testRouter };
}

describe('router integration', () => {
  it('shows the About hero and marks the About icon active at /', async () => {
    await renderApp('/');
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /frontend that stays fast at/i,
      }),
    ).toBeInTheDocument();
    const aboutIcon = screen.getAllByRole('link', { name: 'About me' })[0];
    expect(aboutIcon).toHaveAttribute('aria-current', 'page');
  });

  it('renders the 404.md window for unknown paths', async () => {
    await renderApp('/nope');
    expect(screen.getByText(/this file doesn.t exist/i)).toBeInTheDocument();
    expect(screen.getByText('404.md')).toBeInTheDocument();
  });

  it('marks the Writing icon active on nested routes', async () => {
    await renderApp('/writing');
    const leftRail = screen.getByRole('navigation', { name: 'Desktop, left' });
    expect(within(leftRail).getByRole('link', { name: 'Writing' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});
