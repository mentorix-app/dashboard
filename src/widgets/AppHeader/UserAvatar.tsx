'use client';

import { useTranslations, Link } from '@/i18n';
import { useGetMe, type User } from '@/src/entities/user';
import { ROUTES } from '@/src/shared/lib';
import { Avatar, AvatarFallback, AvatarImage, Skeleton } from '@/src/shared/ui';

const getInitials = (user: User): string => {
  const full = user.name ?? [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  const source = full.length > 0 ? full : user.email;
  const parts = source.split(/\s+|[._-]/).filter(Boolean);
  const initials = parts
    .slice(0, 2)
    .map((p) => p[0])
    .join('');
  return (initials || source[0] || '?').toUpperCase();
};

export const UserAvatar = () => {
  const t = useTranslations('AppHeader');
  const { data: user, isPending } = useGetMe();

  if (isPending || !user) {
    return <Skeleton className="size-8 rounded-full" />;
  }

  return (
    <Link
      href={ROUTES.profile}
      aria-label={t('avatarLabel')}
      className="focus-visible:ring-ring/50 rounded-full outline-none focus-visible:ring-2"
    >
      <Avatar>
        {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt="" /> : null}
        <AvatarFallback>{getInitials(user)}</AvatarFallback>
      </Avatar>
    </Link>
  );
};
