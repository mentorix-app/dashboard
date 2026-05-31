import type { Exercise, ExerciseSortField, ExerciseSortOrder } from '@/src/entities/exercise';

export type ExercisesTableProps = {
  exercises: Exercise[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  selectedIds: ReadonlySet<string>;
  sortBy: ExerciseSortField | undefined;
  sortOrder: ExerciseSortOrder | undefined;
  onToggleRow: (id: string) => void;
  onToggleAllVisible: () => void;
  onSortChange: (field: ExerciseSortField) => void;
  onLoadMore: () => void;
};

export type ExercisesTableHeaderProps = {
  sortBy: ExerciseSortField | undefined;
  sortOrder: ExerciseSortOrder | undefined;
  selectedState: boolean | 'indeterminate';
  isSelectionDisabled: boolean;
  onToggleAllVisible: () => void;
  onSortChange: (field: ExerciseSortField) => void;
};

export type ExercisesTableConfig = Pick<ExercisesTableHeaderProps, 'selectedState' | 'isSelectionDisabled'>;

export type ExercisesTableRowProps = {
  exercise: Exercise;
  isSelected: boolean;
  onToggleRow: (id: string) => void;
};

export type ExercisesTableLoadingProps = {
  rowCount: number;
};

export type ExercisesTableEmptyProps = {
  colSpan: number;
};

export type ExercisesTableLoadMoreProps = {
  disabled: boolean;
  onLoadMore: () => void;
};
