import type { Exercise } from '@/src/entities/exercise';

export type ExercisesTableProps = {
  exercises: Exercise[] | undefined;
  isLoading: boolean;
  selectedIds: ReadonlySet<string>;
  onToggleRow: (id: string) => void;
  onToggleAll: (next: boolean) => void;
};

export type ExercisesTableConfigParams = Pick<ExercisesTableProps, 'exercises' | 'selectedIds'>;

export type ExercisesTableConfig = {
  allSelected: boolean;
  someSelected: boolean;
  isSelectionDisabled: boolean;
};

export type ExercisesTableHeaderProps = {
  allSelected: boolean;
  someSelected: boolean;
  isSelectionDisabled: boolean;
  onToggleAll: (next: boolean) => void;
};

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
