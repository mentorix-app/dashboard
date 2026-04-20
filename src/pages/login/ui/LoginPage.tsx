import { getTranslations } from '@/i18n/server';

import { LoginForm } from './LoginForm';

export async function LoginPage() {
  const t = await getTranslations('Login');

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] w-full flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-semibold tracking-tight text-card-foreground">{t('heading')}</h1>
        <LoginForm
          labels={{
            usernameLabel: t('usernameLabel'),
            usernamePlaceholder: t('usernamePlaceholder'),
            passwordLabel: t('passwordLabel'),
            passwordPlaceholder: t('passwordPlaceholder'),
            submitLabel: t('submit'),
          }}
        />
      </div>
    </div>
  );
}
