import { useTranslations } from '@/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Typography } from '@/src/shared/ui';

const MOCK_TOTAL_EXERCISES = 12;

export const DashboardOverviewCard = () => {
  const t = useTranslations('Dashboard.overviewWidget');

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          <Typography variant="h4" as="span">
            {t('title')}
          </Typography>
        </CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Typography variant="h2" as="p" className="text-primary">
          {t('valueLabel', { count: MOCK_TOTAL_EXERCISES })}
        </Typography>
      </CardContent>
    </Card>
  );
};
