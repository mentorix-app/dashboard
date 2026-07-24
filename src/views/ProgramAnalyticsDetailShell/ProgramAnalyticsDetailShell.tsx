'use client';

import { type ReactNode, useEffect } from 'react';

import { useRouter } from '@/i18n';
import { useCapabilities, useCurrentUser } from '@/src/entities/user';
import { ROUTES } from '@/src/shared/lib';

import { DetailHeader } from './ui/DetailHeader';
import { DetailTabsNav } from './ui/DetailTabsNav';

type ProgramAnalyticsDetailShellProps = {
  programId: string;
  children: ReactNode;
};

export const ProgramAnalyticsDetailShell = ({ programId, children }: ProgramAnalyticsDetailShellProps) => {
  const router = useRouter();
  const user = useCurrentUser();
  const { isTrainer } = useCapabilities();

  useEffect(() => {
    if (user && !isTrainer) router.replace(ROUTES.dashboard);
  }, [user, isTrainer, router]);

  if (!user || !isTrainer) return null;

  return (
    <section className="flex flex-1 flex-col gap-6">
      <DetailHeader programId={programId} />
      <DetailTabsNav programId={programId} />
      {children}
    </section>
  );
};
