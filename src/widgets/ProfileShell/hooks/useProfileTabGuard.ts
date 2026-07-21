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

/**
 * Keep each profile type on its own tab (self → subscription, client →
 * training). A mismatched URL is redirected to the allowed default.
 */
export const useProfileTabGuard = ({ ready, isSelf, activeKey, userId }: ProfileTabGuardParams): void => {
  const router = useRouter();

  useEffect(() => {
    if (!ready || activeKey === '') return;
    const allowedKey = isSelf ? 'subscription' : 'training';
    if (activeKey !== allowedKey) {
      router.replace(isSelf ? ROUTES.userSubscription(userId) : ROUTES.userTraining(userId));
    }
  }, [ready, isSelf, activeKey, userId, router]);
};
