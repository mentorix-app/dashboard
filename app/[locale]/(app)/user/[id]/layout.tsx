import type { ReactNode } from 'react';

import { ProfileShell } from '@/src/widgets/ProfileShell';

type Props = {
  params: Promise<{ locale: string; id: string }>;
  children: ReactNode;
};

export default async function UserProfileLayout({ params, children }: Props) {
  const { id } = await params;
  return <ProfileShell userId={id}>{children}</ProfileShell>;
}
