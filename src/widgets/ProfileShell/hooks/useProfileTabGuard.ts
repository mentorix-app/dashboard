'use client';

import { useEffect } from 'react';

import { useRouter } from '@/i18n';
import { ROUTES } from '@/src/shared/lib';

type ProfileTabGuardParams = {
  /** True once the current user is hydrated (guarding before then would flicker). */
  ready: boolean;
  isSelf: boolean;
  activeKey: string;
  userId: string;
};

/** Tabs of a person's own profile; a client's profile (seen by the trainer) has only `training`. */
const SELF_TAB_KEYS: readonly string[] = ['subscription', 'account'];

/**
 * Keep each profile type on its own tabs (self → subscription and account, client →
 * training). A mismatched URL is redirected to the allowed default.
 */
export const useProfileTabGuard = ({ ready, isSelf, activeKey, userId }: ProfileTabGuardParams): void => {
  const router = useRouter();

  useEffect(() => {
    if (!ready || activeKey === '') return;
    const allowed = isSelf ? SELF_TAB_KEYS.includes(activeKey) : activeKey === 'training';
    if (!allowed) {
      router.replace(isSelf ? ROUTES.userSubscription(userId) : ROUTES.userTraining(userId));
    }
  }, [ready, isSelf, activeKey, userId, router]);
};
