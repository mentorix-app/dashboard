export const ROUTES = {
  dashboard: '/dashboard',
  exercises: '/exercises',
  programs: '/programs',
  login: '/login',
  signup: '/signup',
  profile: '/profile',
  user: (id: string) => `/user/${id}`,
} as const;
