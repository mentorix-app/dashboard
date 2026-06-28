import type { Program } from '@/src/entities/program';

export type ProgramsTableProps = {
  programs: Program[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
};

export type ProgramsTableRowProps = {
  program: Program;
};

export type ProgramsTableEmptyProps = {
  colSpan: number;
};

export type ProgramsTableLoadingProps = {
  rowCount: number;
};

export type ProgramsTableLoadMoreProps = {
  disabled: boolean;
  onLoadMore: () => void;
};
