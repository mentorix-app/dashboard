import { getTranslations } from '@/i18n/server';

import { LoginForm } from './LoginForm';

type LoginPageProps = {
  locale: string;
};

export async function LoginPage({ locale }: LoginPageProps) {
  const t = await getTranslations('Login');

  return (
    <div className="bg-background flex min-h-[calc(100dvh-4rem)] w-full flex-col items-center justify-center px-4 py-8">
      <div className="border-border bg-card w-full max-w-sm rounded-xl border p-6 shadow-sm">
        <h1 className="text-card-foreground mb-6 text-center text-2xl font-semibold tracking-tight">{t('heading')}</h1>
        <LoginForm
          key={locale}
          labels={{
            usernameLabel: t('usernameLabel'),
            usernamePlaceholder: t('usernamePlaceholder'),
            passwordLabel: t('passwordLabel'),
            passwordPlaceholder: t('passwordPlaceholder'),
            submitLabel: t('submit'),
          }}
          validation={{
            usernameRequired: t('validation.usernameRequired'),
            usernameMinLength: t('validation.usernameMinLength'),
            passwordRequired: t('validation.passwordRequired'),
          }}
        />
      </div>
    </div>
  );
}
