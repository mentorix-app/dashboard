'use client';

import { queryKeys, useGet } from '@/src/shared/api';
import type { PlanCatalogResponse } from '@/src/shared/types';

/** GET /plans — the full tariff catalog with each tier's limits. */
export const usePlans = () => useGet<PlanCatalogResponse>('/plans', queryKeys.plans.catalog());
