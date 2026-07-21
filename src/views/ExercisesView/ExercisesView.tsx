'use client';

import { useTranslations } from '@/i18n';
import { Typography } from '@/src/shared/ui';
import { Exercises } from '@/src/widgets/Exercises/Exercises';

export const ExercisesView = () => {
  const t = useTranslations('Exercises');

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Typography variant="h1">{t('title')}</Typography>
        <Typography variant="p-sm" className="text-muted-foreground">
          {t('subtitle')}
        </Typography>
      </div>
      <Exercises />
    </section>
  );
};
