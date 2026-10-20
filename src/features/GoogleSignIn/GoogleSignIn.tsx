'use client';

import { type FC } from 'react';

import { useTranslations } from '@/i18n';
import { AuthErrorAlert } from '@/src/entities/auth';
import { cn } from '@/src/shared/lib/styles';
import { buttonVariants } from '@/src/shared/ui';
import { GoogleIcon } from './GoogleIcon';
import { useGoogleSignInConfig } from './GoogleSignIn.conf';

export const GoogleSignIn: FC = () => {
  const t = useTranslations('Login');
  const { containerRef, status, failure, isPending } = useGoogleSignInConfig();

  return (
    <div className="flex flex-col gap-3">
      <div
        aria-busy={isPending}
        hidden={status === 'unavailable'}
        className={cn('group relative', isPending && 'pointer-events-none opacity-60')}
      >
        {/* People see our own button, so it follows the theme like the Apple one; Google's button lies invisibly on top to take the click. */}
        <div
          aria-hidden
          className={cn(
            buttonVariants({ variant: 'outline', size: 'lg' }),
            'group-hover:bg-muted group-hover:text-foreground dark:group-hover:bg-input/50 pointer-events-none w-full',
            'group-focus-within:border-ring group-focus-within:ring-ring/50 group-focus-within:ring-[3px]'
          )}
        >
          <GoogleIcon className="size-5" />
          {status === 'loading' ? t('google.loading') : t('google.continue')}
        </div>
        <div
          ref={containerRef}
          className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-0"
        />
      </div>
      {status === 'unavailable' && (
        <p role="status" className="text-muted-foreground text-center text-sm">
          {t('google.unavailable')}
        </p>
      )}
      {failure && <AuthErrorAlert failure={failure} />}
    </div>
  );
};
