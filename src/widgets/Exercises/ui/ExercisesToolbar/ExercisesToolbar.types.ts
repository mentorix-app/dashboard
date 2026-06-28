import type {
  ExerciseEquipment,
  ExerciseMuscleGroup,
  ExerciseType,
  FetchExercisesListParams,
} from '@/src/entities/exercise';
import type { Difficulty } from '@/src/shared/types';

export type ExercisesToolbarProps = {
  search: string;
  filtersOpen: boolean;
  listParams: FetchExercisesListParams;
  activeFilterCount: number;
  selectedCount: number;
  canManage: boolean;
  onSearchChange: (value: string) => void;
  onFiltersOpenChange: (open: boolean) => void;
  onCreateNew: () => void;
  onDeleteSelected: () => void;
  onTypeFilterChange: (value: ExerciseType, checked: boolean) => void;
  onMuscleGroupFilterChange: (value: ExerciseMuscleGroup, checked: boolean) => void;
  onEquipmentFilterChange: (value: ExerciseEquipment, checked: boolean) => void;
  onDifficultyFilterChange: (value: Difficulty, checked: boolean) => void;
  onClearFilters: () => void;
};

export type ExercisesFilterPanelProps = Pick<
  ExercisesToolbarProps,
  | 'listParams'
  | 'onTypeFilterChange'
  | 'onMuscleGroupFilterChange'
  | 'onEquipmentFilterChange'
  | 'onDifficultyFilterChange'
>;

export type ExercisesFilterChipsProps = Pick<
  ExercisesToolbarProps,
  | 'listParams'
  | 'activeFilterCount'
  | 'onTypeFilterChange'
  | 'onMuscleGroupFilterChange'
  | 'onEquipmentFilterChange'
  | 'onDifficultyFilterChange'
  | 'onClearFilters'
>;
