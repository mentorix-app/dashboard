/**
 * Central query keys for TanStack Query. Extend when auth/session API is added.
 */
export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },
} as const;
