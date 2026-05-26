'use client';

import { useCallback, useMemo, useState } from 'react';
import { useTranslations } from '@/i18n';
import { useExercises } from '@/src/entities/exercise';
import { useDebouncedValue } from '@/src/shared/hooks';
import { Typography } from '@/src/shared/ui';
import { ExercisesTable } from '@/src/widgets/ExercisesTable/ExercisesTable';
import { ExercisesToolbar } from './ui/ExercisesToolbar';

const SEARCH_DEBOUNCE_MS = 300;

export const ExercisesView = () => {
  const t = useTranslations('Exercises');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);
  const { data: exercises, isPending } = useExercises({ search: debouncedSearch || undefined });

  const handleToggleRow = useCallback((id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleToggleAll = useCallback(
    (shouldSelectAll: boolean) => {
      if (!exercises) return;
      setSelectedIds(shouldSelectAll ? new Set(exercises.map((exercise) => exercise.id)) : new Set());
    },
    [exercises]
  );

  const handleCreateNew = useCallback(() => {
    // TODO: open create-exercise dialog in a follow-up iteration.
  }, []);

  const visibleSelected = useMemo(
    () => new Set(Array.from(selectedIds).filter((id) => exercises?.some((exercise) => exercise.id === id))),
    [selectedIds, exercises]
  );

  return (
    <section className="flex flex-1 flex-col gap-6">
      <Typography variant="h1">{t('title')}</Typography>
      <ExercisesToolbar search={search} onSearchChange={setSearch} onCreateNew={handleCreateNew} />
      <div className="border-border bg-card rounded-md border">
        <ExercisesTable
          exercises={exercises}
          isLoading={isPending}
          selectedIds={visibleSelected}
          onToggleRow={handleToggleRow}
          onToggleAll={handleToggleAll}
        />
      </div>
    </section>
  );
};
