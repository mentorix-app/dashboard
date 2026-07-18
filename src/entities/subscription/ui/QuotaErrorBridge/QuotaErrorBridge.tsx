'use client';

import { useEffect } from 'react';

import { useTranslations } from '@/i18n';
import { useToast } from '@/src/shared/hooks';

import { setQuotaErrorHandler } from '../../model/quotaErrorHandler';

/**
 * Bridges the QueryClient's global mutation error handling into React context.
 * Registers a single quota-error handler that shows a localized toast whenever
 * any mutation fails with a 409 `quota_exceeded` response.
 */
export const QuotaErrorBridge = () => {
  const t = useTranslations('Errors');
  const { showErrorToast } = useToast();

  useEffect(() => {
    setQuotaErrorHandler((quota) => {
      showErrorToast(t('quotaExceeded.title'), {
        description: t('quotaExceeded.description', {
          plan: t(`plan.${quota.plan}`),
          resource: t(`resource.${quota.resource}`),
          usage: quota.usage,
          limit: quota.limit,
        }),
      });
    });

    return () => setQuotaErrorHandler(null);
  }, [t, showErrorToast]);

  return null;
};
