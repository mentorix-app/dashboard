'use client';

import { useCallback, useState } from 'react';

import { Permission, usePermissions } from '@/src/entities/user';

import type { ExercisesConfig } from './Exercises.types';
import { useExercisesDeletion } from './hooks/useExercisesDeletion';
import { useExercisesFilters } from './hooks/useExercisesFilters';
import { useExercisesList } from './hooks/useExercisesList';
import { useExercisesSearch } from './hooks/useExercisesSearch';
import { useExercisesSelection } from './hooks/useExercisesSelection';
import { useExercisesSort } from './hooks/useExercisesSort';

export const useExercisesConfig = (): ExercisesConfig => {
  const { can } = usePermissions();
  const canManage = can(Permission.ExerciseManage);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const handleCreateNew = useCallback(() => {
    setEditingId(undefined);
    setIsFormOpen(true);
  }, []);
  const handleRowClick = useCallback((id: string) => {
    setEditingId(id);
    setIsFormOpen(true);
  }, []);
  const handleFormOpenChange = useCallback((open: boolean) => {
    setIsFormOpen(open);
    if (!open) setEditingId(undefined);
  }, []);
  const search = useExercisesSearch();
  const list = useExercisesList(search.listParams);
  const filters = useExercisesFilters(search);
  const sort = useExercisesSort(search);
  const selection = useExercisesSelection(list.exercises);
  const deletion = useExercisesDeletion({
    exercises: list.exercises,
    selectedIds: selection.selectedIds,
    setSelectedIds: selection.setSelectedIds,
  });

  return {
    search: search.search,
    filtersOpen,
    listParams: search.listParams,
    canManage,
    exercises: list.exercises,
    isPending: list.isPending,
    isFetchingNextPage: list.isFetchingNextPage,
    hasNextPage: list.hasNextPage,
    activeFilterCount: filters.activeFilterCount,
    visibleSelected: selection.visibleSelected,
    selectedExercises: selection.selectedExercises,
    isDeleteDialogOpen: deletion.isDeleteDialogOpen,
    isDeleting: deletion.isDeleting,
    isFormOpen,
    editingId,
    handleSearchChange: search.handleSearchChange,
    handleFiltersOpenChange: setFiltersOpen,
    handleCreateNew,
    handleRowClick,
    handleFormOpenChange,
    handleToggleRow: selection.handleToggleRow,
    handleToggleAllVisible: selection.handleToggleAllVisible,
    handleTypeFilterChange: filters.handleTypeFilterChange,
    handleMuscleGroupFilterChange: filters.handleMuscleGroupFilterChange,
    handleEquipmentFilterChange: filters.handleEquipmentFilterChange,
    handleDifficultyFilterChange: filters.handleDifficultyFilterChange,
    handleClearFilters: filters.handleClearFilters,
    handleSortChange: sort.handleSortChange,
    handleLoadMore: list.handleLoadMore,
    handleDeleteClick: deletion.handleDeleteClick,
    handleDeleteDialogOpenChange: deletion.handleDeleteDialogOpenChange,
    handleConfirmDelete: deletion.handleConfirmDelete,
  };
};
