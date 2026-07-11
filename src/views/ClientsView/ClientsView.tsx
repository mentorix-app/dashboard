'use client';

import { useEffect } from 'react';

import { useRouter, useTranslations } from '@/i18n';
import { Permission, useCurrentUser, usePermissions } from '@/src/entities/user';
import { ROUTES } from '@/src/shared/lib';
import { Typography } from '@/src/shared/ui';
import { Clients } from '@/src/widgets/Clients/Clients';

export const ClientsView = () => {
  const t = useTranslations('Clients');
  const router = useRouter();
  const user = useCurrentUser();
  const { can } = usePermissions();

  const isAllowed = can(Permission.ClientManage);

  useEffect(() => {
    if (user && !isAllowed) {
      router.replace(ROUTES.dashboard);
    }
  }, [user, isAllowed, router]);

  if (!user || !isAllowed) {
    return null;
  }

  return (
    <section className="flex flex-1 flex-col gap-6">
      <Typography variant="h1">{t('title')}</Typography>
      <Clients />
    </section>
  );
};
