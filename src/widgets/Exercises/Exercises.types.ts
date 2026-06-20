import type {
  Exercise,
  ExerciseDifficulty,
  ExerciseEquipment,
  ExerciseMuscleGroup,
  ExerciseSortField,
  ExerciseSortOrder,
  ExerciseType,
  FetchExercisesListParams,
} from '@/src/entities/exercise';

export type ExercisesConfig = {
  search: string;
  filtersOpen: boolean;
  listParams: FetchExercisesListParams;
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
  editingId: string | undefined;
  handleSearchChange: (value: string) => void;
  handleFiltersOpenChange: (open: boolean) => void;
  handleCreateNew: () => void;
  handleRowClick: (id: string) => void;
  handleFormOpenChange: (open: boolean) => void;
  handleToggleRow: (id: string) => void;
  handleToggleAllVisible: () => void;
  handleTypeFilterChange: (value: ExerciseType, checked: boolean) => void;
  handleMuscleGroupFilterChange: (value: ExerciseMuscleGroup, checked: boolean) => void;
  handleEquipmentFilterChange: (value: ExerciseEquipment, checked: boolean) => void;
  handleDifficultyFilterChange: (value: ExerciseDifficulty, checked: boolean) => void;
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
  difficulty?: readonly ExerciseDifficulty[];
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
