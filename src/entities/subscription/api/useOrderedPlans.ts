'use client';

import { useMemo } from 'react';

import type { PlanCatalogItem } from '@/src/shared/types';

import { PLAN_ORDER } from '../model/constants';
import { usePlans } from './usePlans';

/** Fetches the tariff catalog sorted by {@link PLAN_ORDER}. */
export const useOrderedPlans = () => {
  const { data, isLoading } = usePlans();

  const plans = useMemo<PlanCatalogItem[]>(() => {
    const items = data?.items ?? [];
    return [...items].sort((a, b) => PLAN_ORDER.indexOf(a.code) - PLAN_ORDER.indexOf(b.code));
  }, [data]);

  return { plans, isLoading };
};
