'use client';

import { useTranslations } from '@/i18n';
import { Card, CardContent, CardHeader, CardTitle, Typography } from '@/src/shared/ui';

export const ProgramStructureView = () => {
  const t = useTranslations('ProgramWizard');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('structure.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Typography variant="p-sm" className="text-muted-foreground">
          {t('structure.comingSoon')}
        </Typography>
      </CardContent>
    </Card>
  );
};
