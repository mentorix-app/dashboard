'use client';

import { useTranslations } from '@/i18n';

import { getDurationLabel } from '../lib';

/** Localized human duration: `20 сек`, `12 мин`, `1 мин 30 сек`. */
export const useDurationFormatter = () => {
  const t = useTranslations('ProgramWizard');

  return (totalSeconds: number): string => {
    const label = getDurationLabel(totalSeconds);
    switch (label.unit) {
      case 'minutes':
        return t('structure.blocks.settings.units.minutes', { minutes: label.minutes });
      case 'seconds':
        return t('structure.blocks.settings.units.seconds', { seconds: label.seconds });
      case 'minutesSeconds':
        return t('structure.blocks.settings.units.minutesSeconds', {
          minutes: label.minutes,
          seconds: label.seconds,
        });
    }
  };
};
