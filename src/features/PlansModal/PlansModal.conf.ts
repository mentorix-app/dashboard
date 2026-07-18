'use client';

import { useOrderedPlans } from '@/src/entities/subscription';
import { useSubscription } from '@/src/entities/user';
import type { PlanCode } from '@/src/shared/types';

export const usePlansModalConfig = () => {
  const { plans, isLoading } = useOrderedPlans();
  const subscription = useSubscription();

  const currentPlan: PlanCode | null = subscription?.plan ?? null;

  return { plans, currentPlan, isLoading };
};
