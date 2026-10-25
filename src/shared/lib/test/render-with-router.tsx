import { QueryClient } from '@tanstack/react-query';
import { render } from '@testing-library/react';
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
 */
export function renderWithRouter(ui: ReactNode, { path = '/' }: RenderWithRouterOptions = {}) {
  const rootRoute = createRootRoute();
  const testRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '*',
    component: () => <>{ui}</>,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([testRoute]),
    history: createMemoryHistory({ initialEntries: [path] }),
  });

  const rendered = render(<RouterProvider router={router} />);
  return { ...rendered, router };
}
