import { Check } from 'lucide-react';

import { getTranslations } from '@/i18n/server';
import { Logo } from '@/src/shared/ui';

import { SignupForm } from './ui/SignupForm';

type SignUpViewProps = {
  locale: string;
};

export async function SignUpView({ locale }: SignUpViewProps) {
  const t = await getTranslations('Signup');

  const features = [t('feature1'), t('feature2'), t('feature3')];

  return (
    <div className="border-border bg-card grid w-full max-w-4xl overflow-hidden rounded-2xl border shadow-lg md:grid-cols-2">
      <aside className="from-primary/10 via-primary/5 to-background relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br p-10 md:flex">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="bg-primary/10 absolute -top-16 -left-16 size-64 animate-pulse rounded-full blur-3xl" />
          <div className="bg-primary/10 absolute -right-12 -bottom-20 size-72 animate-pulse rounded-full blur-3xl [animation-delay:1.2s]" />
        </div>

        <div className="relative">
          <Logo />
        </div>

        <div className="relative flex flex-col gap-4">
          <h2 className="text-foreground text-2xl leading-tight font-semibold tracking-tight text-balance">
            {t('brandTitle')}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{t('brandSubtitle')}</p>
          <ul className="mt-2 flex flex-col gap-2.5">
            {features.map((feature) => (
              <li key={feature} className="text-foreground flex items-center gap-2.5 text-sm">
                <span className="bg-primary/10 text-primary flex size-5 shrink-0 items-center justify-center rounded-full">
                  <Check className="size-3" aria-hidden />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="flex flex-col justify-center p-6 sm:p-10">
        <h1 className="text-card-foreground mb-6 text-center text-2xl font-semibold tracking-tight">{t('heading')}</h1>
        <SignupForm
          key={locale}
          labels={{
            nameLabel: t('nameLabel'),
            namePlaceholder: t('namePlaceholder'),
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
            nameRequired: t('validation.nameRequired'),
            nameMinLength: t('validation.nameMinLength'),
            emailRequired: t('validation.emailRequired'),
            emailInvalid: t('validation.emailInvalid'),
            passwordRequired: t('validation.passwordRequired'),
          }}
        />
      </div>
    </div>
  );
}
