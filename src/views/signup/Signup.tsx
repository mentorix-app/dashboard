import { getTranslations } from '@/i18n/server';

import { SignupForm } from './ui/SignupForm';

type SignupProps = {
  locale: string;
};

export async function Signup({ locale }: SignupProps) {
  const t = await getTranslations('Signup');

  return (
    <div className="border-border bg-card w-full max-w-sm rounded-xl border p-6 shadow-sm">
      <h1 className="text-card-foreground mb-6 text-center text-2xl font-semibold tracking-tight">{t('heading')}</h1>
      <SignupForm
        key={locale}
        labels={{
          emailLabel: t('emailLabel'),
          emailPlaceholder: t('emailPlaceholder'),
          passwordLabel: t('passwordLabel'),
          passwordPlaceholder: t('passwordPlaceholder'),
          submitLabel: t('submit'),
          alreadyHaveAccount: t('alreadyHaveAccount'),
          signInLabel: t('signIn'),
          signupSuccessMessage: t('signupSuccess'),
          signupErrorFallback: t('signupErrorFallback'),
        }}
        validation={{
          emailRequired: t('validation.emailRequired'),
          emailInvalid: t('validation.emailInvalid'),
          passwordRequired: t('validation.passwordRequired'),
        }}
      />
    </div>
  );
}
