import type { FetchProgramsListParams, ProgramCategory, ProgramStatus } from '@/src/entities/program';
import type { Difficulty } from '@/src/shared/types';

export type ProgramsToolbarProps = {
  search: string;
  filtersOpen: boolean;
  listParams: FetchProgramsListParams;
  activeFilterCount: number;
  selectedCount: number;
  isCreating: boolean;
  onSearchChange: (value: string) => void;
  onFiltersOpenChange: (open: boolean) => void;
  onCreateNew: () => void;
  onDeleteSelected: () => void;
  onStatusFilterChange: (value: ProgramStatus, checked: boolean) => void;
  onCategoryFilterChange: (value: ProgramCategory, checked: boolean) => void;
  onDifficultyFilterChange: (value: Difficulty, checked: boolean) => void;
  onClearFilters: () => void;
};

export type ProgramsFilterPanelProps = Pick<
  ProgramsToolbarProps,
  'listParams' | 'onStatusFilterChange' | 'onCategoryFilterChange' | 'onDifficultyFilterChange'
>;

export type ProgramsFilterChipsProps = Pick<
  ProgramsToolbarProps,
  | 'listParams'
  | 'activeFilterCount'
  | 'onStatusFilterChange'
  | 'onCategoryFilterChange'
  | 'onDifficultyFilterChange'
  | 'onClearFilters'
>;
