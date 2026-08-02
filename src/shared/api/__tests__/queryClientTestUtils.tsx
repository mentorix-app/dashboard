import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, type RenderHookOptions, type RenderHookResult } from '@testing-library/react';
import type { PropsWithChildren, ReactElement } from 'react';

/**
 * Shared test helper for hooks built on TanStack Query (`useGet`, `useInfiniteGet`,
 * `usePost`, etc.). Retries and cache time are disabled so assertions don't have
 * to account for background refetches or cached results leaking across tests.
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

/**
 * Renders a hook wrapped in a fresh `QueryClientProvider`. Pass an existing
 * `client` to share cache state across multiple `renderHook` calls in one test.
 */
export function renderHookWithClient<TResult, TProps>(
  hook: (props: TProps) => TResult,
  options?: Omit<RenderHookOptions<TProps>, 'wrapper'> & { client?: QueryClient }
): RenderHookResult<TResult, TProps> {
  const client = options?.client ?? createTestQueryClient();
  const wrapper = ({ children }: PropsWithChildren): ReactElement => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return renderHook(hook, { ...options, wrapper });
}
