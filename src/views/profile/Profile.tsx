'use client';

import { useLocale, useTranslations } from '@/i18n';
import { useCurrentUser } from '@/src/entities/user';
import { formatDate } from '@/src/shared/lib';
import { Avatar, AvatarFallback, AvatarImage, Card, Typography } from '@/src/shared/ui';
import { SubscriptionPlans } from '@/src/widgets/SubscriptionPlans';

import { ProfileForm } from './ui/ProfileForm';

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
  const locale = useLocale();
  const user = useCurrentUser();

  const fullName = user?.name ?? [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
  const name = fullName || MOCK.name;
  const email = user?.email ?? MOCK.email;
  const roles = user?.roles ?? [];
  const role = roles.join(', ') || MOCK.role;
  const rolesLabel = roles.length > 1 ? t('roles') : t('role');
  const avatarUrl = user?.avatarUrl ?? MOCK.avatarUrl;
  const joinedAt = user?.createdAt ? formatDate(user.createdAt, locale, 'monthYear') : MOCK.joinedAt;
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
            {rolesLabel}: {role}
          </Typography>
          <Typography variant="p-sm" className="text-muted-foreground">
            {t('joined')}: {joinedAt}
          </Typography>
        </div>
      </Card>

      <SubscriptionPlans />

      <Card className="flex flex-col gap-4 p-6">
        <Typography variant="h3">{t('editHeading')}</Typography>
        <ProfileForm
          defaultName={user?.name ?? ''}
          labels={{
            displayedNameLabel: t('displayedNameLabel'),
            displayedNamePlaceholder: t('displayedNamePlaceholder'),
            saveLabel: t('save'),
          }}
          validation={{ nameRequired: t('validation.nameRequired'), nameMinLength: t('validation.nameMinLength') }}
          messages={{ updateSuccess: t('updateSuccess'), updateError: t('updateError') }}
        />
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
