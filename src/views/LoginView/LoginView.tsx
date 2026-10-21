import { Link } from '@/i18n/navigation';
import { getTranslations } from '@/i18n/server';
import { AuthErrorAlert, type AuthErrorCode } from '@/src/entities/auth';
import { AppleSignIn } from '@/src/features/AppleSignIn';
import { GoogleSignIn } from '@/src/features/GoogleSignIn';
import { ROUTES } from '@/src/shared/lib';
import { Logo } from '@/src/shared/ui';

const NOTICE_LINK_CLASS = 'text-foreground underline underline-offset-4';

type LoginViewProps = {
  locale: string;
  /** Failure code Apple's return route puts in the query string. */
  errorCode?: AuthErrorCode;
  /** Set when the person was sent here after deleting their account. */
  accountDeleted?: boolean;
};

export async function LoginView({ locale, errorCode, accountDeleted = false }: LoginViewProps) {
  const t = await getTranslations('Login');

  return (
    <div className="border-border bg-card w-full max-w-sm rounded-2xl border px-6 py-8 shadow-xl shadow-black/5 sm:px-8 sm:py-10">
      <div className="mb-6 flex justify-center">
        <Logo showWordmark={false} className="size-14" />
      </div>
      <h1 className="text-card-foreground mb-2 text-center text-2xl font-semibold tracking-tight">{t('heading')}</h1>
      <p className="text-muted-foreground mb-8 text-center text-sm text-balance">{t('subtitle')}</p>
      <div className="flex flex-col gap-3">
        {accountDeleted && (
          <p role="status" className="bg-muted text-foreground rounded-md px-3 py-2 text-center text-sm">
            {t('deleted')}
          </p>
        )}
        {errorCode && <AuthErrorAlert failure={{ errorCode }} />}
        <GoogleSignIn key={locale} />
        <AppleSignIn label={t('apple.continue')} />
      </div>
      <p className="text-muted-foreground mt-6 text-center text-xs text-balance">
        {t.rich('legalNotice', {
          terms: (chunks) => (
            <Link href={ROUTES.terms} className={NOTICE_LINK_CLASS}>
              {chunks}
            </Link>
          ),
          privacy: (chunks) => (
            <Link href={ROUTES.privacy} className={NOTICE_LINK_CLASS}>
              {chunks}
            </Link>
          ),
        })}
      </p>
    </div>
  );
}
