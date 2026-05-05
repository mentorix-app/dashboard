/**
 * Central query keys for TanStack Query. Extend per feature/widget.
 */
export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },
  exercises: {
    all: ['exercises'] as const,
    list: (params: { search?: string }) => [...queryKeys.exercises.all, 'list', params] as const,
  },
} as const;
