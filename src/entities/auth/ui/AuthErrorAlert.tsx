'use client';

import { useId, type FC } from 'react';

import { useTranslations } from '@/i18n';
import { FormMessage } from '@/src/shared/ui';
import type { AuthFailure } from '../auth.types';

type AuthErrorAlertProps = {
  failure: AuthFailure;
};

/** Translated, screen-reader-announced message for a failed sign-in. */
export const AuthErrorAlert: FC<AuthErrorAlertProps> = ({ failure }) => {
  const t = useTranslations('AuthErrors');
  const id = useId();

  const waitMinutes =
    failure.errorCode === 'rate_limited' && failure.retryAfterSeconds !== undefined
      ? Math.max(1, Math.ceil(failure.retryAfterSeconds / 60))
      : undefined;
  const message = waitMinutes === undefined ? t(failure.errorCode) : t('rate_limited_wait', { minutes: waitMinutes });

  return <FormMessage id={id} message={message} />;
};
