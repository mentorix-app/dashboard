'use client';

import { type FC } from 'react';
import { Table, TableBody } from '@/src/shared/ui';

import { useExercisesTableConfig } from './ExercisesTable.conf';
import type { ExercisesTableProps } from './ExercisesTable.types';
import { ExercisesTableEmpty } from './ui/ExercisesTableEmpty';
import { ExercisesTableHeader } from './ui/ExercisesTableHeader';
import { ExercisesTableLoading } from './ui/ExercisesTableLoading';
import { ExercisesTableRow } from './ui/ExercisesTableRow';

const SKELETON_ROW_COUNT = 5;
const TABLE_COLUMN_COUNT = 7;

export const ExercisesTable: FC<ExercisesTableProps> = ({
  exercises,
  isLoading,
  selectedIds,
  onToggleRow,
  onToggleAll,
}) => {
  const { allSelected, someSelected, isSelectionDisabled } = useExercisesTableConfig({ exercises, selectedIds });

  return (
    <Table>
      <ExercisesTableHeader
        allSelected={allSelected}
        someSelected={someSelected}
        isSelectionDisabled={isSelectionDisabled}
        onToggleAll={onToggleAll}
      />
      <TableBody>
        {isLoading ? <ExercisesTableLoading rowCount={SKELETON_ROW_COUNT} /> : null}
        {!isLoading && exercises?.length === 0 ? <ExercisesTableEmpty colSpan={TABLE_COLUMN_COUNT} /> : null}
        {!isLoading
          ? exercises?.map((exercise) => (
              <ExercisesTableRow
                key={exercise.id}
                exercise={exercise}
                isSelected={selectedIds.has(exercise.id)}
                onToggleRow={onToggleRow}
              />
            ))
          : null}
      </TableBody>
    </Table>
  );
};
