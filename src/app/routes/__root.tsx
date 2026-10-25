import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { HeadContent, Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        title: 'Igor Martynov — Staff Software Engineer',
      },
      {
        name: 'description',
        content:
          'Igor Martynov — Staff Software Engineer in Prague. React, TypeScript, architecture and developer experience.',
      },
    ],
  }),
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <HeadContent />
      <Outlet />
      {/* No-op in production builds. */}
      <TanStackRouterDevtools />
    </>
  );
}
