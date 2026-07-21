'use client';

import { useTransition } from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';

import { useTranslations, Link } from '@/i18n';
import { logoutAction } from '@/src/entities/auth';
import { useCurrentUser, useUserStore, type User } from '@/src/entities/user';
import { ROUTES } from '@/src/shared/lib';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Skeleton,
} from '@/src/shared/ui';

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
  const user = useCurrentUser();
  const [isLoggingOut, startTransition] = useTransition();

  if (!user) {
    return <Skeleton className="size-8 rounded-full" />;
  }

  const handleLogout = () => {
    startTransition(() => {
      // Reset the store so the avatar/menu clear immediately; the query cache is
      // wiped on next login when the session identity changes (see UserHydrator).
      useUserStore.getState().clearUser();
      void logoutAction();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('avatarLabel')}
        className="focus-visible:ring-ring/50 cursor-pointer rounded-full outline-none focus-visible:ring-2"
      >
        <Avatar>
          {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt="" /> : null}
          <AvatarFallback>{getInitials(user)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuItem asChild>
          <Link href={ROUTES.userSubscription(user.userId)}>
            <UserIcon />
            {t('profile')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" disabled={isLoggingOut} onSelect={handleLogout}>
          <LogOut />
          {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
