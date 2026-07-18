/**
 * Subscription, plan, and quota contracts shared across the app. These mirror
 * the backend schemas (see api/openapi.yaml) after the BFF converts snake_case
 * payloads to camelCase, so both the `user` and `subscription` entities can
 * import from this single source of truth without cross-entity dependencies.
 */

export enum PlanCode {
  Free = 'free',
  Advance = 'advance',
  Elite = 'elite',
}

export const PLAN_CODE_OPTIONS: readonly PlanCode[] = [PlanCode.Free, PlanCode.Advance, PlanCode.Elite];

/** Who issued the active entitlement; null on the free tier. */
export enum SubscriptionSource {
  Admin = 'admin',
  AppStore = 'app_store',
  GooglePlay = 'google_play',
}

/** Null values mean unlimited for that resource. */
export type PlanLimits = {
  exercises: number | null;
  activePrograms: number | null;
  activeClients: number | null;
};

export type PlanUsage = {
  exercises: number;
  activePrograms: number;
  activeClients: number;
};

export type PlanPermissions = {
  canCreateExercise: boolean;
  canEditExercises: boolean;
  canCreateProgram: boolean;
  canEditPrograms: boolean;
  canCreateInvite: boolean;
  canManageClients: boolean;
};

/**
 * Effective plan of the current trainer profile. Null for administrators and
 * users without a trainer profile (GET /auth/me returns `subscription: null`).
 */
export type Subscription = {
  plan: PlanCode;
  source: SubscriptionSource | null;
  validUntil: string | null;
  limits: PlanLimits;
  usage: PlanUsage;
  permissions: PlanPermissions;
};

export type PlanCatalogItem = {
  code: PlanCode;
  limits: PlanLimits;
};

export type PlanCatalogResponse = {
  items: PlanCatalogItem[];
};

/** Resource whose quota was exceeded, as reported by 409 responses. */
export enum QuotaResource {
  Exercises = 'exercises',
  Programs = 'programs',
  Clients = 'clients',
}

/** Body returned with HTTP 409 when a plan quota is exceeded. */
export type QuotaExceededError = {
  error: 'quota_exceeded';
  resource: QuotaResource;
  plan: PlanCode;
  limit: number;
  usage: number;
};
