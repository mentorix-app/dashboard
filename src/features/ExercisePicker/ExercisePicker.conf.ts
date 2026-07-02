'use client';

import { useMemo, useState } from 'react';

import { useLocale, useTranslations } from '@/i18n';
import { getExerciseName, useExercisesInfinite, type Exercise } from '@/src/entities/exercise';
import { useDebouncedValue } from '@/src/shared/hooks';

import { MAX_PICK, PICKER_SEARCH_DEBOUNCE_MS } from './ExercisePicker.constants';
import type { ExercisePickerProps } from './ExercisePicker.types';

/**
 * Owns the picker's search, paginated catalog list, and capped (≤10) multi
 * selection. Selection and search reset whenever the dialog closes so a later
 * open starts clean, all without state-in-effect.
 */
export const useExercisePickerConfig = ({ open, onOpenChange, onConfirm, excludeIds }: ExercisePickerProps) => {
  const t = useTranslations('ExercisePicker');
  const locale = useLocale();

  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const debouncedSearch = useDebouncedValue(search.trim(), PICKER_SEARCH_DEBOUNCE_MS);
  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } = useExercisesInfinite({
    name: debouncedSearch || undefined,
  });

  const exclude = useMemo(() => new Set(excludeIds ?? []), [excludeIds]);
  const exercises = useMemo(
    () => (data?.pages.flatMap((page) => page.items) ?? []).filter((exercise) => !exclude.has(exercise.id)),
    [data, exclude]
  );

  const selectedCount = selectedIds.size;
  const canSelectMore = selectedCount < MAX_PICK;

  const reset = () => {
    setSearch('');
    setSelectedIds(new Set());
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < MAX_PICK) next.add(id);
      return next;
    });
  };

  const handleConfirm = () => {
    if (selectedCount === 0) return;
    onConfirm(Array.from(selectedIds));
    reset();
    onOpenChange(false);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  return {
    t,
    open,
    onOpenChange: handleOpenChange,
    search,
    onSearchChange: setSearch,
    exercises,
    getName: (exercise: Exercise) => getExerciseName(exercise, locale),
    isPending,
    isFetchingNextPage,
    hasNextPage: Boolean(hasNextPage),
    onLoadMore: handleLoadMore,
    isSelected: (id: string) => selectedIds.has(id),
    onToggle: handleToggle,
    canSelectMore,
    selectedCount,
    maxPick: MAX_PICK,
    onConfirm: handleConfirm,
  };
};
