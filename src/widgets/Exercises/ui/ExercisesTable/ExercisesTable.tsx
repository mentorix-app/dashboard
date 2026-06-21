import { type FC } from 'react';
import { Table, TableBody } from '@/src/shared/ui';

import { useExercisesTableConfig } from './ExercisesTable.conf';
import { NEXT_PAGE_SKELETON_ROW_COUNT, SKELETON_ROW_COUNT, TABLE_COLUMN_COUNT } from './ExercisesTable.constants';
import type { ExercisesTableProps } from './ExercisesTable.types';
import { ExercisesTableEmpty } from './ui/ExercisesTableEmpty';
import { ExercisesTableHeader } from './ui/ExercisesTableHeader';
import { ExercisesTableLoadMore } from './ui/ExercisesTableLoadMore';
import { ExercisesTableLoading } from './ui/ExercisesTableLoading';
import { ExercisesTableRow } from './ui/ExercisesTableRow';

export const ExercisesTable: FC<ExercisesTableProps> = ({
  exercises,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  selectedIds,
  activeId,
  canSelect,
  sortBy,
  sortOrder,
  onToggleRow,
  onToggleAllVisible,
  onRowClick,
  onSortChange,
  onLoadMore,
}) => {
  const { selectedState, isSelectionDisabled } = useExercisesTableConfig({
    exercises,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    selectedIds,
    activeId,
    canSelect,
    sortBy,
    sortOrder,
    onToggleRow,
    onToggleAllVisible,
    onRowClick,
    onSortChange,
    onLoadMore,
  });

  const columnCount = canSelect ? TABLE_COLUMN_COUNT : TABLE_COLUMN_COUNT - 1;

  return (
    <>
      <Table>
        <ExercisesTableHeader
          sortBy={sortBy}
          sortOrder={sortOrder}
          selectedState={selectedState}
          isSelectionDisabled={isSelectionDisabled}
          canSelect={canSelect}
          onToggleAllVisible={onToggleAllVisible}
          onSortChange={onSortChange}
        />
        <TableBody>
          {isLoading ? <ExercisesTableLoading rowCount={SKELETON_ROW_COUNT} showSelect={canSelect} /> : null}
          {!isLoading && exercises.length === 0 ? <ExercisesTableEmpty colSpan={columnCount} /> : null}
          {!isLoading
            ? exercises.map((exercise) => (
                <ExercisesTableRow
                  key={exercise.id}
                  exercise={exercise}
                  isSelected={selectedIds.has(exercise.id)}
                  isActive={activeId === exercise.id}
                  canSelect={canSelect}
                  onToggleRow={onToggleRow}
                  onRowClick={onRowClick}
                />
              ))
            : null}
          {isFetchingNextPage ? (
            <ExercisesTableLoading rowCount={NEXT_PAGE_SKELETON_ROW_COUNT} showSelect={canSelect} />
          ) : null}
        </TableBody>
      </Table>
      <ExercisesTableLoadMore disabled={!hasNextPage || isFetchingNextPage || isLoading} onLoadMore={onLoadMore} />
    </>
  );
};
