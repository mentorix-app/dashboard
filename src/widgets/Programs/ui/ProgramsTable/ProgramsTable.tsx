import { type FC, useMemo } from 'react';
import { Table, TableBody } from '@/src/shared/ui';

import { NEXT_PAGE_SKELETON_ROW_COUNT, SKELETON_ROW_COUNT, TABLE_COLUMN_COUNT } from './ProgramsTable.constants';
import type { ProgramsTableProps } from './ProgramsTable.types';
import { ProgramsTableEmpty } from './ui/ProgramsTableEmpty';
import { ProgramsTableHeader } from './ui/ProgramsTableHeader';
import { ProgramsTableLoadMore } from './ui/ProgramsTableLoadMore';
import { ProgramsTableLoading } from './ui/ProgramsTableLoading';
import { ProgramsTableRow } from './ui/ProgramsTableRow';

export const ProgramsTable: FC<ProgramsTableProps> = ({
  programs,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  selectedIds,
  canManageProgram,
  sortBy,
  sortOrder,
  onToggleRow,
  onToggleAllVisible,
  onSortChange,
  onLoadMore,
}) => {
  const selectableIds = useMemo(
    () => programs.filter((program) => canManageProgram(program)).map((program) => program.id),
    [programs, canManageProgram]
  );
  const canSelect = selectableIds.length > 0;
  const selectedCount = selectableIds.filter((id) => selectedIds.has(id)).length;
  const selectedState: boolean | 'indeterminate' =
    selectedCount === 0 ? false : selectedCount === selectableIds.length ? true : 'indeterminate';
  const columnCount = canSelect ? TABLE_COLUMN_COUNT + 1 : TABLE_COLUMN_COUNT;

  return (
    <>
      <Table>
        <ProgramsTableHeader
          sortBy={sortBy}
          sortOrder={sortOrder}
          selectedState={selectedState}
          isSelectionDisabled={isLoading || selectableIds.length === 0}
          canSelect={canSelect}
          onToggleAllVisible={onToggleAllVisible}
          onSortChange={onSortChange}
        />
        <TableBody>
          {isLoading ? <ProgramsTableLoading rowCount={SKELETON_ROW_COUNT} showSelect={canSelect} /> : null}
          {!isLoading && programs.length === 0 ? <ProgramsTableEmpty colSpan={columnCount} /> : null}
          {!isLoading
            ? programs.map((program) => (
                <ProgramsTableRow
                  key={program.id}
                  program={program}
                  isSelected={selectedIds.has(program.id)}
                  canSelect={canSelect}
                  canManage={canManageProgram(program)}
                  onToggleRow={onToggleRow}
                />
              ))
            : null}
          {isFetchingNextPage ? (
            <ProgramsTableLoading rowCount={NEXT_PAGE_SKELETON_ROW_COUNT} showSelect={canSelect} />
          ) : null}
        </TableBody>
      </Table>
      <ProgramsTableLoadMore disabled={!hasNextPage || isFetchingNextPage || isLoading} onLoadMore={onLoadMore} />
    </>
  );
};
