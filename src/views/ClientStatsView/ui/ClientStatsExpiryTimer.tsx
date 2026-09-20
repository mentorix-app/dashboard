'use client';

import { type FC, useEffect, useState } from 'react';
import { Clock3 } from 'lucide-react';

import { useTranslations } from '@/i18n';

import { getRemainingMinutes } from '../ClientStatsView.utils';

type ClientStatsExpiryTimerProps = {
  expiresAt: string;
};

export const ClientStatsExpiryTimer: FC<ClientStatsExpiryTimerProps> = ({ expiresAt }) => {
  const t = useTranslations('ClientStatsPage');
  const [remainingMinutes, setRemainingMinutes] = useState(() => getRemainingMinutes(expiresAt));

  useEffect(() => {
    const updateRemaining = () => setRemainingMinutes(getRemainingMinutes(expiresAt));
    const intervalId = window.setInterval(updateRemaining, 30_000);
    return () => window.clearInterval(intervalId);
  }, [expiresAt]);

  const isExpired = remainingMinutes === 0;

  return (
    <p
      role="status"
      className={
        isExpired
          ? 'flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-300'
          : 'text-muted-foreground flex items-center gap-2 text-sm'
      }
    >
      <Clock3 aria-hidden className="size-4 shrink-0" />
      {isExpired ? t('expiry.expired') : t('expiry.inMinutes', { count: remainingMinutes })}
    </p>
  );
};
