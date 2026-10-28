import { createRouter } from '@tanstack/react-router';
import { ErrorPage } from '@/pages/error';
import { NotFoundPage } from '@/pages/not-found';
import { WindowSkeleton } from '@/shared/ui/window';
import { routeTree } from '../routeTree.gen';

/**
 * The URL is the window-manager state: every "window" is a route, so deep
 * links, back/forward and per-page titles come for free. View transitions
 * animate the window swap in browsers that support them.
 */
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultViewTransition: true,
  defaultPendingMs: 150,
  defaultPendingComponent: WindowSkeleton,
  defaultNotFoundComponent: NotFoundPage,
  defaultErrorComponent: ErrorPage,
});

// Only a pathname change swaps the window. Search-only and same-URL
// navigations (selection, filters, re-clicking the open window) keep it in
// place. Same-URL navigations ignore a per-call `viewTransition`, hence here.
router.subscribe('onBeforeNavigate', ({ pathChanged }) => {
  if (!pathChanged) router.shouldViewTransition = false;
});

// Register the router for end-to-end type safety.
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
