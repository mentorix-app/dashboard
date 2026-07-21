'use client';

import { type FC } from 'react';
import { ArrowLeft } from 'lucide-react';

import { Link } from '@/i18n';
import { Card, Skeleton, Typography } from '@/src/shared/ui';

import { useProfileShellConfig } from './ProfileShell.conf';
import type { ProfileShellHeader, ProfileShellProps } from './ProfileShell.types';
import { ProfileSidebar } from './ui/ProfileSidebar/ProfileSidebar';
import { ProfileTabNav } from './ui/ProfileTabNav';

const ShellHeader: FC<{ header: ProfileShellHeader }> = ({ header }) => (
  <header className="flex flex-col gap-1">
    {header.backHref && header.backLabel ? (
      <Link
        href={header.backHref}
        className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1.5 text-sm underline-offset-4 hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {header.backLabel}
      </Link>
    ) : null}
    {header.title ? <Typography variant="h1">{header.title}</Typography> : null}
    {header.subtitle ? (
      <Typography variant="p-sm" className="text-muted-foreground">
        {header.subtitle}
      </Typography>
    ) : null}
  </header>
);

export const ProfileShell: FC<ProfileShellProps> = ({ userId, children }) => {
  const { isReady, error, header, sidebar, tabs, activeKey, tabNavLabel } = useProfileShellConfig(userId);

  if (!isReady) {
    return (
      <section className="flex flex-1 flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_1fr]">
          <Skeleton className="h-96 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-1 flex-col gap-6">
        <ShellHeader header={header} />
        <Card className="text-muted-foreground flex min-h-48 items-center justify-center p-6 text-center text-sm">
          {error}
        </Card>
      </section>
    );
  }

  return (
    <section className="flex flex-1 flex-col gap-6">
      <ShellHeader header={header} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_1fr] lg:items-start">
        <div className="lg:sticky lg:top-[calc(var(--app-header-height)+1.5rem)]">
          <ProfileSidebar {...sidebar} />
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <ProfileTabNav tabs={tabs} activeKey={activeKey} aria-label={tabNavLabel} />
          {children}
        </div>
      </div>
    </section>
  );
};
