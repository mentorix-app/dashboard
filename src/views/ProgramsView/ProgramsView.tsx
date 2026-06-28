'use client';

import { useTranslations } from '@/i18n';
import { Typography } from '@/src/shared/ui';
import { Programs } from '@/src/widgets/Programs/Programs';

export const ProgramsView = () => {
  const t = useTranslations('Programs');

  return (
    <section className="flex flex-1 flex-col gap-6">
      <Typography variant="h1">{t('title')}</Typography>
      <Programs />
    </section>
  );
};
