import type {
  FetchProgramsListParams,
  Program,
  ProgramCategory,
  ProgramSortField,
  ProgramSortOrder,
  ProgramStatus,
} from '@/src/entities/program';
import type { Difficulty } from '@/src/shared/types';

export type ProgramsConfig = {
  search: string;
  filtersOpen: boolean;
  listParams: FetchProgramsListParams;
  programs: Program[];
  isPending: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  activeFilterCount: number;
  visibleSelected: ReadonlySet<string>;
  selectedPrograms: Program[];
  isDeleteDialogOpen: boolean;
  isDeleting: boolean;
  canManageProgram: (program: Program) => boolean;
  handleSearchChange: (value: string) => void;
  handleFiltersOpenChange: (open: boolean) => void;
  handleCreateNew: () => void;
  handleToggleRow: (id: string) => void;
  handleToggleAllVisible: () => void;
  handleStatusFilterChange: (value: ProgramStatus, checked: boolean) => void;
  handleCategoryFilterChange: (value: ProgramCategory, checked: boolean) => void;
  handleDifficultyFilterChange: (value: Difficulty, checked: boolean) => void;
  handleClearFilters: () => void;
  handleSortChange: (field: ProgramSortField) => void;
  handleLoadMore: () => void;
  handleDeleteClick: () => void;
  handleDeleteDialogOpenChange: (open: boolean) => void;
  handleConfirmDelete: () => void;
};

export type ProgramsSearchParamUpdateMode = 'push' | 'replace';

export type ProgramsSearchParamUpdates = {
  name?: string;
  status?: readonly ProgramStatus[];
  category?: readonly ProgramCategory[];
  difficulty?: readonly Difficulty[];
  sortBy?: ProgramSortField;
  sortOrder?: ProgramSortOrder;
};

export type ProgramsSearchParamsController = {
  search: string;
  listParams: FetchProgramsListParams;
  updateSearchParams: (updates: ProgramsSearchParamUpdates, mode?: ProgramsSearchParamUpdateMode) => void;
  handleSearchChange: (value: string) => void;
};

export type ProgramsSortState = {
  sortBy?: ProgramSortField;
  sortOrder?: ProgramSortOrder;
};
