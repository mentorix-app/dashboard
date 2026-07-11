export const ROUTES = {
  dashboard: '/dashboard',
  exercises: '/exercises',
  programs: '/programs',
  programBasics: (id: string) => `/programs/${id}/basics`,
  clients: '/clients',
  login: '/login',
  signup: '/signup',
  profile: '/profile',
  user: (id: string) => `/user/${id}`,
} as const;
