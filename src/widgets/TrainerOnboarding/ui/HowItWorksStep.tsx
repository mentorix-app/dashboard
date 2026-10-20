'use client';

import { type FC } from 'react';

import { useTranslations } from '@/i18n';
import { Button } from '@/src/shared/ui';
import { HOW_IT_WORKS_ITEMS } from '../TrainerOnboarding.constants';

type HowItWorksStepProps = {
  onFinish: () => void;
};

export const HowItWorksStep: FC<HowItWorksStepProps> = ({ onFinish }) => {
  const t = useTranslations('TrainerOnboarding');

  return (
    <>
      <ol className="flex flex-col gap-4">
        {HOW_IT_WORKS_ITEMS.map((item, index) => (
          <li key={item} className="flex items-start gap-3">
            <span
              aria-hidden
              className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
            >
              {index + 1}
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{t(`howItWorks.steps.${item}.title`)}</span>
              <span className="text-muted-foreground text-sm">{t(`howItWorks.steps.${item}.description`)}</span>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex justify-end">
        <Button onClick={onFinish}>{t('howItWorks.start')}</Button>
      </div>
    </>
  );
};
