import { act, render, screen, within } from '@testing-library/react';
import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router';
import { describe, expect, it } from 'vitest';
import { getProjectBySlug } from '@/entities/project';
import { getPostBySlug } from '@/entities/post';
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

  it('keeps cross-entity content references intact', () => {
    // Entities cannot import each other, so the cross-check lives here.
    const post = getPostBySlug('telegram-pm-hub-in-5-days');
    expect(getProjectBySlug(post?.relatedProject ?? '')).toBeDefined();
  });

  it('filters the explorer from the URL (?kind=work shows 1 row)', async () => {
    await renderApp('/projects?kind=work');
    const rows = document.querySelectorAll('a[data-selected]');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent('universal-tree');
  });

  it('shows 404.md for a project without a case study', async () => {
    await renderApp('/projects/distill');
    expect(screen.getByText(/this file doesn.t exist/i)).toBeInTheDocument();
  });

  it('renders the case study with its MDX body', async () => {
    await renderApp('/projects/pm-telegram-hub');
    expect(screen.getByRole('heading', { level: 1, name: /pm telegram hub/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /how it.s built/i })).toBeInTheDocument();
    expect(screen.getByText('Adapters layer')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /all projects/i })).toHaveAttribute(
      'href',
      '/projects',
    );
  });

  it('renders the post with its CONTENTS nav and footer links', async () => {
    await renderApp('/writing/telegram-pm-hub-in-5-days');
    expect(screen.getByRole('navigation', { name: 'Contents' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /day 1 · spec first/i })).toHaveAttribute(
      'href',
      '#day-1--spec-first',
    );
    expect(screen.getByText(/6 min read/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /see the project/i })).toHaveAttribute(
      'href',
      '/projects/pm-telegram-hub',
    );
    expect(screen.getByRole('link', { name: /questions\? write to me/i })).toHaveAttribute(
      'href',
      '/contact',
    );
  });

  it('shows 404.md for an unknown writing post slug', async () => {
    await renderApp('/writing/non-existent-post');
    expect(screen.getByText(/this file doesn.t exist/i)).toBeInTheDocument();
  });

  it('falls back gracefully on invalid project search params', async () => {
    await renderApp('/projects?kind=bogus&tag=invalid');
    const allRows = document.querySelectorAll('a[data-selected]');
    expect(allRows).toHaveLength(4);
  });

  it('restores valid project deep links from the URL', async () => {
    await renderApp('/projects?kind=side&selected=distill');
    expect(screen.getByRole('complementary', { name: 'Preview' })).toHaveTextContent('Distill');
  });
});
