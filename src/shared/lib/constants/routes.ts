export const ROUTES = {
  dashboard: '/dashboard',
  exercises: '/exercises',
  programs: '/programs',
  programBasics: (id: string) => `/programs/${id}/basics`,
  clients: '/clients',
  analytics: '/analytics',
  programAnalytics: (id: string) => `/analytics/${id}`,
  login: '/login',
  signup: '/signup',
  user: (id: string) => `/user/${id}`,
  userSubscription: (id: string) => `/user/${id}/subscription`,
  userTraining: (id: string) => `/user/${id}/training`,
} as const;
