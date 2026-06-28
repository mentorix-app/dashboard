'use client';

import { useCallback } from 'react';
import type { ProgramSortField } from '@/src/entities/program';

import type { ProgramsSearchParamsController } from '../Programs.types';

export const useProgramsSort = ({ listParams, updateSearchParams }: ProgramsSearchParamsController) => {
  const handleSortChange = useCallback(
    (field: ProgramSortField) => {
      if (listParams.sortBy !== field) {
        updateSearchParams({ sortBy: field, sortOrder: 'asc' });
        return;
      }

      if (listParams.sortOrder === 'asc') {
        updateSearchParams({ sortBy: field, sortOrder: 'desc' });
        return;
      }

      updateSearchParams({ sortBy: undefined, sortOrder: undefined });
    },
    [listParams.sortBy, listParams.sortOrder, updateSearchParams]
  );

  return { handleSortChange };
};
