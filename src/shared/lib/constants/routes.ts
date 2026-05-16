export const ROUTES = {
  dashboard: '/dashboard',
  exercises: '/exercises',
  login: '/login',
  signup: '/signup',
  user: (id: string) => `/user/${id}`,
} as const;
