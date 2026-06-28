import { type FC } from 'react';
import { Skeleton, TableCell, TableRow } from '@/src/shared/ui';

import { TABLE_COLUMN_COUNT } from '../ProgramsTable.constants';
import type { ProgramsTableLoadingProps } from '../ProgramsTable.types';

export const ProgramsTableLoading: FC<ProgramsTableLoadingProps> = ({ rowCount }) =>
  Array.from({ length: rowCount }).map((_, rowIndex) => (
    <TableRow key={`skeleton-${rowIndex}`}>
      {Array.from({ length: TABLE_COLUMN_COUNT }).map((__, cellIndex) => (
        <TableCell key={`skeleton-cell-${cellIndex}`}>
          <Skeleton className="h-4 w-24" />
        </TableCell>
      ))}
    </TableRow>
  ));
