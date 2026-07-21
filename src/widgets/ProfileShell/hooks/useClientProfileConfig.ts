'use client';

import { useLocale, useTranslations } from '@/i18n';
import { useClientAnalytics } from '@/src/entities/analytics';
import { getClientAvatarSrc } from '@/src/entities/client';
import { formatDate, ROUTES } from '@/src/shared/lib';

import type { ProfileViewModel } from '../ProfileShell.types';
import { EMPTY_SIDEBAR, getInitials } from '../ProfileShell.utils';

/**
 * Build the shell view-model for a client's profile. Analytics feed both the
 * sidebar and the training tab; `enabled` gates the request off the self view.
 */
export const useClientProfileConfig = (userId: string, enabled: boolean): ProfileViewModel => {
  const tc = useTranslations('ClientProfile');
  const locale = useLocale();
  const analyticsQuery = useClientAnalytics(userId, enabled);

  const header = { backHref: ROUTES.clients, backLabel: tc('backToClients') };
  const clientTabs = [{ key: 'training', label: tc('trainingTab'), href: ROUTES.userTraining(userId) }];

  if (analyticsQuery.isLoading) {
    return { isReady: false, error: null, header, sidebar: EMPTY_SIDEBAR, tabs: clientTabs };
  }

  const analytics = analyticsQuery.data;
  if (analyticsQuery.isError || !analytics) {
    const status = analyticsQuery.error?.status;
    const error =
      status === 404 ? tc('errors.notLinked') : status === 403 ? tc('errors.forbidden') : tc('errors.generic');
    return { isReady: true, error, header, sidebar: EMPTY_SIDEBAR, tabs: [] };
  }

  const { client, currentAssignment } = analytics;
  const nameKey = locale === 'ru' ? 'programNameRu' : 'programName';
  const programName = currentAssignment ? currentAssignment[nameKey] : tc('noProgram');

  return {
    isReady: true,
    error: null,
    header,
    sidebar: {
      name: client.displayName,
      initials: getInitials(client.displayName),
      avatarUrl: getClientAvatarSrc(client.avatarUrl),
      avatarAlt: client.displayName,
      badge:
        client.status === 'active'
          ? { label: tc('status.active'), tone: 'active' }
          : { label: tc('status.blocked'), tone: 'neutral' },
      meta: [
        { id: 'program', label: tc('currentProgram'), value: programName },
        { id: 'linked', label: tc('linked'), value: formatDate(client.linkedAt, locale, 'longDate') },
        {
          id: 'lastActive',
          label: tc('lastActive'),
          value: client.lastActiveAt ? formatDate(client.lastActiveAt, locale, 'longDate') : tc('never'),
        },
      ],
    },
    tabs: clientTabs,
  };
};
