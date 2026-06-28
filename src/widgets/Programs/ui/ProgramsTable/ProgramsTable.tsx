import { type FC } from 'react';
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
  onLoadMore,
}) => (
  <>
    <Table>
      <ProgramsTableHeader />
      <TableBody>
        {isLoading ? <ProgramsTableLoading rowCount={SKELETON_ROW_COUNT} /> : null}
        {!isLoading && programs.length === 0 ? <ProgramsTableEmpty colSpan={TABLE_COLUMN_COUNT} /> : null}
        {!isLoading ? programs.map((program) => <ProgramsTableRow key={program.id} program={program} />) : null}
        {isFetchingNextPage ? <ProgramsTableLoading rowCount={NEXT_PAGE_SKELETON_ROW_COUNT} /> : null}
      </TableBody>
    </Table>
    <ProgramsTableLoadMore disabled={!hasNextPage || isFetchingNextPage || isLoading} onLoadMore={onLoadMore} />
  </>
);
