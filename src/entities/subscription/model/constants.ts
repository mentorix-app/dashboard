import { PlanCode } from '@/src/shared/types';

/** Display order for the tariff catalog, cheapest to most capable. */
export const PLAN_ORDER: readonly PlanCode[] = [PlanCode.Free, PlanCode.Advance, PlanCode.Elite];
