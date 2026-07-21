'use client';

import { type FC } from 'react';
import { BadgeCheck } from 'lucide-react';

import { Link } from '@/i18n';
import { cn } from '@/src/shared/lib/styles';
import { Avatar, AvatarFallback, AvatarImage, Badge, Card, Typography } from '@/src/shared/ui';

import { EditableDisplayName } from '../EditableDisplayName/EditableDisplayName';
import type { ProfileSidebarProps, ProfileSidebarStatTone } from './ProfileSidebar.types';

const STAT_TONE: Record<ProfileSidebarStatTone, string> = {
  default: 'text-foreground',
  positive: 'text-emerald-600 dark:text-emerald-400',
  attention: 'text-amber-600 dark:text-amber-400',
};

export const ProfileSidebar: FC<ProfileSidebarProps> = ({
  name,
  initials,
  avatarUrl,
  avatarAlt,
  editableName = false,
  badge,
  username,
  meta,
  stats,
}) => (
  <Card className="flex flex-col gap-5 p-6">
    <div className="flex flex-col items-center gap-3 text-center">
      <Avatar className="size-24">
        {avatarUrl ? <AvatarImage src={avatarUrl} alt={avatarAlt} /> : null}
        <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
      </Avatar>

      <div className="flex w-full flex-col items-center gap-2">
        {editableName ? (
          <EditableDisplayName defaultName={name} />
        ) : (
          <Typography variant="h2" className="break-words">
            {name}
          </Typography>
        )}

        {badge ? (
          <Badge
            variant={badge.tone === 'active' ? 'secondary' : 'outline'}
            className={cn(
              badge.tone === 'active' &&
                'border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
            )}
          >
            {badge.label}
          </Badge>
        ) : null}

        {username ? (
          <span className="text-muted-foreground inline-flex items-center gap-1 text-sm">
            <BadgeCheck className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden />@{username}
          </span>
        ) : null}
      </div>
    </div>

    <dl className="flex flex-col gap-3 border-t pt-4">
      {meta.map((item) => (
        <div key={item.id} className="flex flex-col gap-0.5">
          <dt className="text-muted-foreground text-xs">{item.label}</dt>
          <dd className="text-sm font-medium">
            {item.href ? (
              <Link href={item.href} className="underline-offset-4 hover:underline">
                {item.value}
              </Link>
            ) : (
              item.value
            )}
          </dd>
        </div>
      ))}
    </dl>

    {stats && stats.length > 0 ? (
      <dl className="flex flex-col gap-2 border-t pt-4">
        {stats.map((stat) => (
          <div key={stat.id} className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground text-sm">{stat.label}</dt>
            <dd className={cn('text-sm font-semibold', STAT_TONE[stat.tone ?? 'default'])}>{stat.value}</dd>
          </div>
        ))}
      </dl>
    ) : null}
  </Card>
);
