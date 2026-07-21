'use client';

import { usePathname, useTranslations } from '@/i18n';
import { useCurrentUser } from '@/src/entities/user';

import { useClientProfileConfig } from './hooks/useClientProfileConfig';
import { useProfileTabGuard } from './hooks/useProfileTabGuard';
import { useSelfProfileConfig } from './hooks/useSelfProfileConfig';
import type { ProfileShellConfig } from './ProfileShell.types';
import { EMPTY_SIDEBAR, resolveActiveKey } from './ProfileShell.utils';

export const useProfileShellConfig = (userId: string): ProfileShellConfig => {
  const t = useTranslations('Profile');
  const pathname = usePathname();
  const user = useCurrentUser();

  const isSelf = user?.userId === userId;
  const activeKey = resolveActiveKey(pathname);

  useProfileTabGuard({ ready: Boolean(user), isSelf: Boolean(isSelf), activeKey, userId });

  // Both sub-hooks run every render (rules of hooks); the client analytics query
  // is gated by `enabled` so it never fires on the self profile.
  const selfModel = useSelfProfileConfig(user);
  const clientModel = useClientProfileConfig(userId, Boolean(user) && !isSelf);

  const shared = { activeKey, tabNavLabel: t('tabsAriaLabel') };

  if (!user) {
    return { isReady: false, error: null, header: {}, sidebar: EMPTY_SIDEBAR, tabs: [], ...shared };
  }

  return { ...(isSelf ? selfModel : clientModel), ...shared };
};
