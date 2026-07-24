import { Card, Typography } from '@/src/shared/ui';

type WeekResultsEmptyProps = {
  title: string;
  description: string;
};

export const WeekResultsEmpty = ({ title, description }: WeekResultsEmptyProps) => (
  <Card className="items-center gap-2 p-10 text-center">
    <Typography variant="h3">{title}</Typography>
    <Typography variant="p-sm" className="text-muted-foreground max-w-md">
      {description}
    </Typography>
  </Card>
);
