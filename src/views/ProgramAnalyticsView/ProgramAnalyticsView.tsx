'use client';

import { useEffect } from 'react';

import { useRouter } from '@/i18n';
import { useCapabilities, useCurrentUser } from '@/src/entities/user';
import { ROUTES } from '@/src/shared/lib';
import { ProgramAnalytics } from '@/src/widgets/ProgramAnalytics';

type ProgramAnalyticsViewProps = {
  programId: string;
};

export const ProgramAnalyticsView = ({ programId }: ProgramAnalyticsViewProps) => {
  const router = useRouter();
  const user = useCurrentUser();
  const { isTrainer } = useCapabilities();

  useEffect(() => {
    if (user && !isTrainer) router.replace(ROUTES.dashboard);
  }, [user, isTrainer, router]);

  if (!user || !isTrainer) return null;

  return (
    <section className="flex flex-1 flex-col">
      <ProgramAnalytics programId={programId} />
    </section>
  );
};
