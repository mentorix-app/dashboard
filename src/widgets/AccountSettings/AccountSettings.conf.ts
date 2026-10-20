'use client';

import { useState } from 'react';

import { useTranslations } from '@/i18n';
import {
  APPLE_ACCOUNT_DELETION_START_PATH,
  deleteAccountAction,
  type DeleteAccountErrorCode,
} from '@/src/entities/auth';
import { isAdmin, isTrainer, useCurrentUser } from '@/src/entities/user';
import { ROUTES } from '@/src/shared/lib';
import { confirm } from '@/src/shared/ui';
import { navigateTo } from './AccountSettings.utils';

type AccountSettingsConfigParams = {
  /** Why a deletion that went through Apple did not finish; Apple sends the browser back with the code. */
  initialError?: DeleteAccountErrorCode;
};

export const useAccountSettingsConfig = ({ initialError }: AccountSettingsConfigParams) => {
  const t = useTranslations('Account');
  const user = useCurrentUser();
  const [errorCode, setErrorCode] = useState<DeleteAccountErrorCode | undefined>(initialError);

  const deleteAccountNow = async (): Promise<void> => {
    setErrorCode(undefined);

    let result;
    try {
      result = await deleteAccountAction();
    } catch {
      setErrorCode('unavailable');
      return;
    }

    // A full page load, so nothing of the deleted account stays in memory.
    if (!result) {
      navigateTo(`${ROUTES.login}?deleted=1`);
      return;
    }
    // An account with an Apple sign-in is deleted only after a fresh Apple authorization.
    if (result.errorCode === 'apple_required') {
      navigateTo(APPLE_ACCOUNT_DELETION_START_PATH);
      return;
    }
    setErrorCode(result.errorCode);
  };

  const requestDeletion = (): void =>
    confirm({
      title: t('confirm.title'),
      description: t('confirm.description'),
      cancelLabel: t('confirm.cancel'),
      confirmLabel: t('confirm.submit'),
      onConfirm: deleteAccountNow,
    });

  return {
    isReady: user !== null,
    isAdmin: user ? isAdmin(user.roles) : false,
    isTrainer: user ? isTrainer(user.roles) : false,
    errorMessage: errorCode ? t(`errors.${errorCode}`) : undefined,
    requestDeletion,
  };
};
