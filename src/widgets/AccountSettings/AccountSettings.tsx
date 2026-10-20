'use client';

import { useId, type FC } from 'react';

import { useTranslations } from '@/i18n';
import type { DeleteAccountErrorCode } from '@/src/entities/auth';
import { Button, Card, FormMessage, Skeleton, Typography } from '@/src/shared/ui';

import { useAccountSettingsConfig } from './AccountSettings.conf';

type AccountSettingsProps = {
  initialError?: DeleteAccountErrorCode;
};

export const AccountSettings: FC<AccountSettingsProps> = ({ initialError }) => {
  const t = useTranslations('Account');
  const errorId = useId();
  const { isReady, isAdmin, isTrainer, errorMessage, requestDeletion } = useAccountSettingsConfig({ initialError });

  if (!isReady) return <Skeleton className="h-48 w-full rounded-xl" />;

  return (
    <Card className="border-destructive/40 flex flex-col gap-4 p-6">
      <Typography variant="h3">{t('heading')}</Typography>

      {isAdmin ? (
        <Typography variant="p-sm" className="text-muted-foreground">
          {t('adminNote')}
        </Typography>
      ) : (
        <>
          <Typography variant="p-sm" className="text-muted-foreground">
            {t('description')}
          </Typography>
          {isTrainer && (
            <Typography variant="p-sm" className="text-muted-foreground">
              {t('trainerNote')}
            </Typography>
          )}
          <FormMessage id={errorId} message={errorMessage} />
          <div>
            <Button
              type="button"
              variant="destructive"
              aria-describedby={errorMessage ? errorId : undefined}
              onClick={requestDeletion}
            >
              {t('button')}
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};
