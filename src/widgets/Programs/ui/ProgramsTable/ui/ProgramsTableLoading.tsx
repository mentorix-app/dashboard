import { type FC } from 'react';
import { Skeleton, TableCell, TableRow } from '@/src/shared/ui';

import { TABLE_COLUMN_COUNT } from '../ProgramsTable.constants';
import type { ProgramsTableLoadingProps } from '../ProgramsTable.types';

export const ProgramsTableLoading: FC<ProgramsTableLoadingProps> = ({ rowCount, showSelect }) =>
  Array.from({ length: rowCount }).map((_, rowIndex) => (
    <TableRow key={`skeleton-${rowIndex}`}>
      {showSelect ? (
        <TableCell>
          <Skeleton className="size-4" />
        </TableCell>
      ) : null}
      {Array.from({ length: TABLE_COLUMN_COUNT }).map((__, cellIndex) => (
        <TableCell key={`skeleton-cell-${cellIndex}`}>
          <Skeleton className="h-4 w-24" />
        </TableCell>
      ))}
      <TableCell>
        <Skeleton className="ml-auto size-4" />
      </TableCell>
    </TableRow>
  ));
