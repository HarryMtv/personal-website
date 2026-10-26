import { QueryClient } from '@tanstack/react-query';
import { act, render } from '@testing-library/react';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import type { ReactNode } from 'react';

export interface RenderWithRouterOptions {
  /** Initial URL, including any search params (e.g. `/projects?kind=work`). */
  path?: string;
}

/** A throwaway QueryClient with retries off so tests fail fast. */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

/**
 * Renders `ui` inside a minimal throwaway router over a memory history, so
 * components using `Link`/`useNavigate` can be tested without the real app
 * route tree. The catch-all route renders `ui` at any path.
 *
 * Await it: RouterProvider commits its first render asynchronously (it runs
 * inside a React transition), so the helper flushes once before returning.
 */
export async function renderWithRouter(
  ui: ReactNode,
  { path = '/' }: RenderWithRouterOptions = {},
) {
  const rootRoute = createRootRoute();
  const renderUi = () => <>{ui}</>;
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: renderUi,
  });
  // Splat route so components render at any nested path (e.g. /projects).
  const anyRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/$',
    component: renderUi,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, anyRoute]),
    history: createMemoryHistory({ initialEntries: [path] }),
  });

  const rendered = render(<RouterProvider router={router} />);
  // Flush the router's initial transition (see the doc comment above).
  await act(async () => {
    await Promise.resolve();
  });
  return { ...rendered, router };
}
