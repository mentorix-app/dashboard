'use client';

import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';
import { handleMutationError, QuotaErrorBridge } from '@/src/entities/subscription';
import { HttpError } from '@/src/shared/api';
import { MINUTE, MS } from '@/src/shared/lib/constants';
import { Toaster } from '@/src/shared/ui';

const defaultQueryOptions = {
  queries: {
    staleTime: MINUTE * MS,
    // Never retry auth/permission failures: a 401/403 will not succeed on a
    // retry and only multiplies the redirect-to-login storm. Other errors keep
    // the default retry behaviour.
    retry: (failureCount: number, error: unknown) => {
      if (error instanceof HttpError && (error.status === 401 || error.status === 403)) return false;
      return failureCount < 3;
    },
  },
} as const;

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: defaultQueryOptions,
        // Surface 409 quota errors from any mutation in one place (toast).
        mutationCache: new MutationCache({
          onError: (error) => handleMutationError(error),
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <QuotaErrorBridge />
      {children}
      <Toaster />
      {process.env.NODE_ENV === 'development' ? (
        <ReactQueryDevtools buttonPosition="bottom-right" initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  );
}
