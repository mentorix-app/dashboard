import { type FC } from 'react';
import { Skeleton, TableCell, TableRow } from '@/src/shared/ui';

import type { ExercisesTableLoadingProps } from '../ExercisesTable.types';

export const ExercisesTableLoading: FC<ExercisesTableLoadingProps> = ({ rowCount }) =>
  Array.from({ length: rowCount }).map((_, index) => (
    <TableRow key={`skeleton-${index}`}>
      <TableCell>
        <Skeleton className="size-4" />
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-64" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-28" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
    </TableRow>
  ));
