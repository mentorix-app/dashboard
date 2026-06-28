import { type FC } from 'react';
import { useTranslations } from '@/i18n';
import { TableCell, TableRow, Typography } from '@/src/shared/ui';

import type { ProgramsTableEmptyProps } from '../ProgramsTable.types';

export const ProgramsTableEmpty: FC<ProgramsTableEmptyProps> = ({ colSpan }) => {
  const t = useTranslations('Programs');

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
