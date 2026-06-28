'use client';

import { useCallback, useMemo, useState } from 'react';

import { useCreateProgram, type Program } from '@/src/entities/program';
import { useCurrentUser, UserRole } from '@/src/entities/user';

import type { ProgramsConfig } from './Programs.types';
import { useProgramsDeletion } from './hooks/useProgramsDeletion';
import { useProgramsFilters } from './hooks/useProgramsFilters';
import { useProgramsList } from './hooks/useProgramsList';
import { useProgramsSearch } from './hooks/useProgramsSearch';
import { useProgramsSelection } from './hooks/useProgramsSelection';
import { useProgramsSort } from './hooks/useProgramsSort';

export const useProgramsConfig = (): ProgramsConfig => {
  const currentUser = useCurrentUser();
  const isAdmin = currentUser?.roles.includes(UserRole.Admin) ?? false;
  const userId = currentUser?.userId;

  // Ownership-based access: admins manage every program, while trainers and
  // other authenticated users can only manage the programs they created.
  const canManageProgram = useCallback(
    (program: Program) => isAdmin || program.createdBy === userId,
    [isAdmin, userId]
  );

  const [filtersOpen, setFiltersOpen] = useState(false);
  const createProgram = useCreateProgram();
  const handleCreateNew = useCallback(() => {
    createProgram.mutate();
  }, [createProgram]);

  const search = useProgramsSearch();
  const list = useProgramsList(search.listParams);
  const filters = useProgramsFilters(search);
  const sort = useProgramsSort(search);
  const selection = useProgramsSelection(list.programs, canManageProgram);
  const deletion = useProgramsDeletion({
    programs: list.programs,
    selectedIds: selection.selectedIds,
    setSelectedIds: selection.setSelectedIds,
  });

  return useMemo(
    () => ({
      search: search.search,
      filtersOpen,
      listParams: search.listParams,
      programs: list.programs,
      isPending: list.isPending,
      isFetchingNextPage: list.isFetchingNextPage,
      hasNextPage: list.hasNextPage,
      activeFilterCount: filters.activeFilterCount,
      visibleSelected: selection.visibleSelected,
      selectedPrograms: selection.selectedPrograms,
      isDeleteDialogOpen: deletion.isDeleteDialogOpen,
      isDeleting: deletion.isDeleting,
      canManageProgram,
      handleSearchChange: search.handleSearchChange,
      handleFiltersOpenChange: setFiltersOpen,
      handleCreateNew,
      handleToggleRow: selection.handleToggleRow,
      handleToggleAllVisible: selection.handleToggleAllVisible,
      handleStatusFilterChange: filters.handleStatusFilterChange,
      handleCategoryFilterChange: filters.handleCategoryFilterChange,
      handleDifficultyFilterChange: filters.handleDifficultyFilterChange,
      handleClearFilters: filters.handleClearFilters,
      handleSortChange: sort.handleSortChange,
      handleLoadMore: list.handleLoadMore,
      handleDeleteClick: deletion.handleDeleteClick,
      handleDeleteDialogOpenChange: deletion.handleDeleteDialogOpenChange,
      handleConfirmDelete: deletion.handleConfirmDelete,
    }),
    [search, filtersOpen, list, filters, selection, deletion, sort, canManageProgram, handleCreateNew]
  );
};
