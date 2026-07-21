'use client';

import { useLocale, useTranslations } from '@/i18n';
import type { User } from '@/src/entities/user';
import { formatDate, ROUTES } from '@/src/shared/lib';

import type { ProfileViewModel } from '../ProfileShell.types';
import { EMPTY_SIDEBAR, getInitials } from '../ProfileShell.utils';

/** Build the shell view-model for the signed-in user's own profile. */
export const useSelfProfileConfig = (user: User | null): ProfileViewModel => {
  const t = useTranslations('Profile');
  const locale = useLocale();

  if (!user) {
    return { isReady: false, error: null, header: {}, sidebar: EMPTY_SIDEBAR, tabs: [] };
  }

  const name = user.name ?? [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  const displayName = name.length > 0 ? name : user.email;
  const rolesLabel = user.roles.length > 1 ? t('roles') : t('role');

  return {
    isReady: true,
    error: null,
    header: { title: t('title') },
    sidebar: {
      name: displayName,
      initials: getInitials(displayName, user.email),
      avatarUrl: user.avatarUrl,
      avatarAlt: displayName,
      editableName: true,
      meta: [
        { id: 'email', label: t('email'), value: user.email },
        { id: 'role', label: rolesLabel, value: user.roles.join(', ') || '—' },
        { id: 'joined', label: t('joined'), value: formatDate(user.createdAt, locale, 'monthYear') },
      ],
    },
    tabs: [{ key: 'subscription', label: t('subscriptionTab'), href: ROUTES.userSubscription(user.userId) }],
  };
};
