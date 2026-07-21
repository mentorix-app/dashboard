'use client';

import { type FC, useEffect } from 'react';

import { useRouter } from '@/i18n';
import { useCurrentUser } from '@/src/entities/user';
import { ROUTES } from '@/src/shared/lib';

type ProfileTabRedirectProps = {
  userId: string;
};

/**
 * Sends a bare `/user/[id]` visit to that profile's default tab: the trainer's
 * own profile opens the subscription tab, a client profile opens training.
 */
export const ProfileTabRedirect: FC<ProfileTabRedirectProps> = ({ userId }) => {
  const router = useRouter();
  const user = useCurrentUser();

  useEffect(() => {
    if (!user) {
      return;
    }
    const target = user.userId === userId ? ROUTES.userSubscription(userId) : ROUTES.userTraining(userId);
    router.replace(target);
  }, [user, userId, router]);

  return null;
};
