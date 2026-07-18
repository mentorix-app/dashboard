'use client';

import { useTranslations } from '@/i18n';
import { SubscriptionCard } from '@/src/entities/subscription';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Skeleton,
} from '@/src/shared/ui';

import { usePlansModalConfig } from './PlansModal.conf';
import type { PlansModalProps } from './PlansModal.types';

export const PlansModal = ({ open, onOpenChange }: PlansModalProps) => {
  const t = useTranslations('PlansModal');
  const { plans, currentPlan, isLoading } = usePlansModalConfig();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-3">
          {isLoading
            ? [0, 1, 2].map((key) => <Skeleton key={key} className="h-44 w-full" />)
            : plans.map((plan) => (
                <SubscriptionCard
                  key={plan.code}
                  code={plan.code}
                  limits={plan.limits}
                  isCurrent={plan.code === currentPlan}
                />
              ))}
        </div>

        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
