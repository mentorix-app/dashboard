'use client';

import { useTranslations } from '@/i18n';
import { useCurrentUser } from '@/src/entities/user';
import { Avatar, AvatarFallback, AvatarImage, Card, Typography } from '@/src/shared/ui';

const MOCK = {
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  role: 'Coach',
  joinedAt: 'January 2024',
  bio: 'Strength & conditioning coach. Loves heavy squats and long walks on the beach.',
  avatarUrl: 'https://i.pravatar.cc/200?img=12',
};

export const Profile = () => {
  const t = useTranslations('Profile');
  const user = useCurrentUser();

  const fullName = user?.name ?? [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
  const name = fullName || MOCK.name;
  const email = user?.email ?? MOCK.email;
  const role = user?.roles?.join(', ') || MOCK.role;
  const avatarUrl = user?.avatarUrl ?? MOCK.avatarUrl;
  const initials = (
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0])
      .join('') || '?'
  ).toUpperCase();

  return (
    <section className="flex flex-1 flex-col gap-6">
      <Typography variant="h1">{t('title')}</Typography>

      <Card className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-start">
        <Avatar className="size-24">
          <AvatarImage src={avatarUrl} alt="" />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex flex-1 flex-col gap-2 text-center sm:text-left">
          <Typography variant="h2">{name}</Typography>
          <Typography variant="p-sm" className="text-muted-foreground">
            {email}
          </Typography>
          <Typography variant="p-sm" className="text-muted-foreground">
            {t('role')}: {role}
          </Typography>
          <Typography variant="p-sm" className="text-muted-foreground">
            {t('joined')}: {MOCK.joinedAt}
          </Typography>
        </div>
      </Card>

      <Card className="p-6">
        <Typography variant="h3" className="mb-2">
          {t('about')}
        </Typography>
        <Typography>{MOCK.bio}</Typography>
      </Card>
    </section>
  );
};
