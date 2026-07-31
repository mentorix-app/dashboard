'use client';

import { useCallback, useState } from 'react';

import { type Exercise, canManageExercise } from '@/src/entities/exercise';
import { useCapabilities, useCurrentUser } from '@/src/entities/user';

import type { ExercisesConfig } from './Exercises.types';
import { useExercisesDeletion } from './hooks/useExercisesDeletion';
import { useExercisesFilters } from './hooks/useExercisesFilters';
import { useExercisesList } from './hooks/useExercisesList';
import { useExercisesSearch } from './hooks/useExercisesSearch';
import { useExercisesSelection } from './hooks/useExercisesSelection';
import { useExercisesSort } from './hooks/useExercisesSort';

export const useExercisesConfig = (): ExercisesConfig => {
  const { isAdmin, isTrainer, canCreateExercise } = useCapabilities();
  const currentUser = useCurrentUser();
  const canManage = isAdmin || isTrainer;
  const canManageExerciseFn = useCallback(
    (exercise: Exercise) => canManageExercise(exercise, { isAdmin, isTrainer, userId: currentUser?.userId }),
    [isAdmin, isTrainer, currentUser?.userId]
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const handleCreateNew = () => {
    if (!canCreateExercise) {
      setIsPlansModalOpen(true);
      return;
    }
    setEditingId(undefined);
    setIsFormOpen(true);
  };
  const handleRowClick = (id: string) => {
    setEditingId(id);
    setIsFormOpen(true);
  };
  const handleFormOpenChange = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) setEditingId(undefined);
  };
  const search = useExercisesSearch();
  const list = useExercisesList(search.listParams);
  const filters = useExercisesFilters(search);
  const sort = useExercisesSort(search);
  const selection = useExercisesSelection(list.exercises, canManageExerciseFn);
  const deletion = useExercisesDeletion({
    exercises: list.exercises,
    selectedIds: selection.selectedIds,
    setSelectedIds: selection.setSelectedIds,
  });

  const editingExercise = list.exercises.find((exercise) => exercise.id === editingId);
  const isFormReadOnly = editingId ? !(editingExercise && canManageExerciseFn(editingExercise)) : false;

  return {
    search: search.search,
    filtersOpen,
    listParams: search.listParams,
    canManage,
    canManageExercise: canManageExerciseFn,
    exercises: list.exercises,
    isPending: list.isPending,
    isFetchingNextPage: list.isFetchingNextPage,
    hasNextPage: list.hasNextPage,
    activeFilterCount: filters.activeFilterCount,
    visibleSelected: selection.visibleSelected,
    selectedExercises: selection.selectedExercises,
    isFormOpen,
    isFormReadOnly,
    isPlansModalOpen,
    editingId,
    handleSearchChange: search.handleSearchChange,
    handleFiltersOpenChange: setFiltersOpen,
    handleCreateNew,
    handlePlansModalOpenChange: setIsPlansModalOpen,
    handleRowClick,
    handleFormOpenChange,
    handleToggleRow: selection.handleToggleRow,
    handleToggleAllVisible: selection.handleToggleAllVisible,
    handleTypeFilterChange: filters.handleTypeFilterChange,
    handleMuscleGroupFilterChange: filters.handleMuscleGroupFilterChange,
    handleEquipmentFilterChange: filters.handleEquipmentFilterChange,
    handleDifficultyFilterChange: filters.handleDifficultyFilterChange,
    handleScopeFilterChange: filters.handleScopeFilterChange,
    handleClearFilters: filters.handleClearFilters,
    handleSortChange: sort.handleSortChange,
    handleLoadMore: list.handleLoadMore,
    handleDeleteClick: deletion.handleDeleteClick,
  };
};
