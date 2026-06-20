import { QUERY_KEY_AUTH, QUERY_KEY_EXERCISES, QUERY_KEY_USER } from './base.constants';

/**
 * Central query keys for TanStack Query. Extend per feature/widget.
 */
export const queryKeys = {
  auth: {
    all: [QUERY_KEY_AUTH] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },
  exercises: {
    all: [QUERY_KEY_EXERCISES] as const,
    list: (params: object) => [...queryKeys.exercises.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.exercises.all, 'detail', id] as const,
  },
  user: {
    all: [QUERY_KEY_USER] as const,
    me: () => [...queryKeys.user.all, 'me'] as const,
  },
} as const;

export function messageFromErrorBody(data: unknown): string | null {
  if (typeof data !== 'object' || data === null) return null;

  const body = data as Record<string, unknown>;

  if (typeof body.message === 'string') return body.message;
  if (typeof body.error === 'string') return body.error;
  if (typeof body.detail === 'string') return body.detail;

  if (Array.isArray(body.detail)) {
    const parts = body.detail
      .map((item) => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null && 'msg' in item) {
          const msg = (item as { msg?: unknown }).msg;
          return typeof msg === 'string' ? msg : '';
        }
        return '';
      })
      .filter(Boolean);

    if (parts.length > 0) return parts.join(' ');
  }

  return null;
}
