'use client';

import { type FC } from 'react';
import { useExercisesConfig } from './Exercises.conf';
import { ExercisesTable } from './ui/ExercisesTable/ExercisesTable';
import { ExercisesToolbar } from './ui/ExercisesToolbar/ExercisesToolbar';

export const Exercises: FC = () => {
  const {
    search,
    exercises,
    isPending,
    visibleSelected,
    handleSearchChange,
    handleCreateNew,
    handleToggleRow,
    handleToggleAll,
  } = useExercisesConfig();

  return (
    <>
      <ExercisesToolbar search={search} onSearchChange={handleSearchChange} onCreateNew={handleCreateNew} />
      <div className="border-border bg-card overflow-x-auto rounded-md border">
        <ExercisesTable
          exercises={exercises}
          isLoading={isPending}
          selectedIds={visibleSelected}
          onToggleRow={handleToggleRow}
          onToggleAll={handleToggleAll}
        />
      </div>
    </>
  );
};
