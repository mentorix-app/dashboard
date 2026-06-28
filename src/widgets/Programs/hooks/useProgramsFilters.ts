'use client';

import { useCallback } from 'react';
import type { ProgramCategory, ProgramStatus } from '@/src/entities/program';
import type { Difficulty } from '@/src/shared/types';

import type { ProgramsSearchParamsController } from '../Programs.types';

export const useProgramsFilters = ({ listParams, updateSearchParams }: ProgramsSearchParamsController) => {
  const handleStatusFilterChange = useCallback(
    (value: ProgramStatus, checked: boolean) => {
      updateSearchParams({ status: checked ? [value] : [] });
    },
    [updateSearchParams]
  );

  const handleCategoryFilterChange = useCallback(
    (value: ProgramCategory, checked: boolean) => {
      updateSearchParams({ category: checked ? [value] : [] });
    },
    [updateSearchParams]
  );

  const handleDifficultyFilterChange = useCallback(
    (value: Difficulty, checked: boolean) => {
      updateSearchParams({ difficulty: checked ? [value] : [] });
    },
    [updateSearchParams]
  );

  const handleClearFilters = useCallback(() => {
    updateSearchParams({ status: [], category: [], difficulty: [] });
  }, [updateSearchParams]);

  const activeFilterCount =
    (listParams.status?.length ?? 0) + (listParams.category?.length ?? 0) + (listParams.difficulty?.length ?? 0);

  return {
    activeFilterCount,
    handleStatusFilterChange,
    handleCategoryFilterChange,
    handleDifficultyFilterChange,
    handleClearFilters,
  };
};
