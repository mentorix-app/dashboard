import { type FC } from 'react';
import { useTranslations } from '@/i18n';
import { TableCell, TableRow, Typography } from '@/src/shared/ui';

import type { ExercisesTableEmptyProps } from '../ExercisesTable.types';

export const ExercisesTableEmpty: FC<ExercisesTableEmptyProps> = ({ colSpan }) => {
  const t = useTranslations('Exercises');

  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center">
        <Typography variant="p-sm" as="span" className="text-muted-foreground">
          {t('empty')}
        </Typography>
      </TableCell>
    </TableRow>
  );
};
