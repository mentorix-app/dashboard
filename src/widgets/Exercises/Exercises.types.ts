import type {
  Exercise,
  ExerciseEquipment,
  ExerciseMuscleGroup,
  ExerciseScope,
  ExerciseSortField,
  ExerciseSortOrder,
  ExerciseType,
  FetchExercisesListParams,
} from '@/src/entities/exercise';
import type { Difficulty } from '@/src/shared/types';

export type ExercisesConfig = {
  search: string;
  filtersOpen: boolean;
  listParams: FetchExercisesListParams;
  canManage: boolean;
  canManageExercise: (exercise: Exercise) => boolean;
  exercises: Exercise[];
  isPending: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  activeFilterCount: number;
  visibleSelected: ReadonlySet<string>;
  selectedExercises: Exercise[];
  isDeleteDialogOpen: boolean;
  isDeleting: boolean;
  isFormOpen: boolean;
  isFormReadOnly: boolean;
  isPlansModalOpen: boolean;
  editingId: string | undefined;
  handleSearchChange: (value: string) => void;
  handleFiltersOpenChange: (open: boolean) => void;
  handleCreateNew: () => void;
  handlePlansModalOpenChange: (open: boolean) => void;
  handleRowClick: (id: string) => void;
  handleFormOpenChange: (open: boolean) => void;
  handleToggleRow: (id: string) => void;
  handleToggleAllVisible: () => void;
  handleTypeFilterChange: (value: ExerciseType, checked: boolean) => void;
  handleMuscleGroupFilterChange: (value: ExerciseMuscleGroup, checked: boolean) => void;
  handleEquipmentFilterChange: (value: ExerciseEquipment, checked: boolean) => void;
  handleDifficultyFilterChange: (value: Difficulty, checked: boolean) => void;
  handleScopeFilterChange: (value: ExerciseScope | undefined) => void;
  handleClearFilters: () => void;
  handleSortChange: (field: ExerciseSortField) => void;
  handleLoadMore: () => void;
  handleDeleteClick: () => void;
  handleDeleteDialogOpenChange: (open: boolean) => void;
  handleConfirmDelete: () => void;
};

export type ExercisesSearchParamUpdateMode = 'push' | 'replace';

export type ExercisesSearchParamUpdates = {
  name?: string;
  type?: readonly ExerciseType[];
  muscleGroup?: readonly ExerciseMuscleGroup[];
  equipment?: readonly ExerciseEquipment[];
  difficulty?: readonly Difficulty[];
  scope?: ExerciseScope;
  sortBy?: ExerciseSortField;
  sortOrder?: ExerciseSortOrder;
};

export type ExercisesSearchParamsController = {
  search: string;
  listParams: FetchExercisesListParams;
  updateSearchParams: (updates: ExercisesSearchParamUpdates, mode?: ExercisesSearchParamUpdateMode) => void;
  handleSearchChange: (value: string) => void;
};

export type ExercisesSortState = {
  sortBy?: ExerciseSortField;
  sortOrder?: ExerciseSortOrder;
};
