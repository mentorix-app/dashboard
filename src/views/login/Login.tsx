import { getTranslations } from '@/i18n/server';
import { LoginForm } from './ui/LoginForm';

type LoginProps = {
  locale: string;
};

export async function Login({ locale }: LoginProps) {
  const t = await getTranslations('Login');

  return (
    <div className="border-border bg-card w-full max-w-sm rounded-xl border p-6 shadow-sm">
      <h1 className="text-card-foreground mb-6 text-center text-2xl font-semibold tracking-tight">{t('heading')}</h1>
      <LoginForm
        key={locale}
        labels={{
          emailLabel: t('emailLabel'),
          emailPlaceholder: t('emailPlaceholder'),
          passwordLabel: t('passwordLabel'),
          passwordPlaceholder: t('passwordPlaceholder'),
          forgotPasswordLabel: t('forgotPassword'),
          submitLabel: t('submit'),
          newToMentorix: t('newToMentorix'),
          createAccountLabel: t('createAccount'),
          loginSuccessMessage: t('loginSuccess'),
          loginErrorFallback: t('loginErrorFallback'),
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
