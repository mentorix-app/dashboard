import type { Program, ProgramSortField, ProgramSortOrder } from '@/src/entities/program';

export type ProgramsTableProps = {
  programs: Program[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  selectedIds: ReadonlySet<string>;
  canManageProgram: (program: Program) => boolean;
  sortBy: ProgramSortField | undefined;
  sortOrder: ProgramSortOrder | undefined;
  onToggleRow: (id: string) => void;
  onToggleAllVisible: () => void;
  onSortChange: (field: ProgramSortField) => void;
  onLoadMore: () => void;
  onDeleteRow: (id: string) => void;
};

export type ProgramsTableHeaderProps = {
  sortBy: ProgramSortField | undefined;
  sortOrder: ProgramSortOrder | undefined;
  selectedState: boolean | 'indeterminate';
  isSelectionDisabled: boolean;
  canSelect: boolean;
  onToggleAllVisible: () => void;
  onSortChange: (field: ProgramSortField) => void;
};

export type ProgramsTableRowProps = {
  program: Program;
  isSelected: boolean;
  canSelect: boolean;
  canManage: boolean;
  onToggleRow: (id: string) => void;
  onDeleteRow: (id: string) => void;
};

export type ProgramsTableEmptyProps = {
  colSpan: number;
};

export type ProgramsTableLoadingProps = {
  rowCount: number;
  showSelect: boolean;
};

export type ProgramsTableLoadMoreProps = {
  disabled: boolean;
  onLoadMore: () => void;
};
