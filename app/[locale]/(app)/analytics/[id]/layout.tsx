import type { ReactNode } from 'react';

import { ProgramAnalyticsDetailShell } from '@/src/views/ProgramAnalyticsDetailShell';

type Props = {
  params: Promise<{ locale: string; id: string }>;
  children: ReactNode;
};

export default async function ProgramAnalyticsDetailLayout({ params, children }: Props) {
  const { id } = await params;
  return <ProgramAnalyticsDetailShell programId={id}>{children}</ProgramAnalyticsDetailShell>;
}
