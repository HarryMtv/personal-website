import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { MotionConfig } from 'motion/react';
import type { PropsWithChildren } from 'react';
import { queryClient } from '@/shared/lib/query-client';

/** Wraps the app in shared context providers (Query, Motion, devtools, …). */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* `reducedMotion="user"` disables transforms/animations per OS setting. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
      {/* No-op in production builds. */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
