'use client';

import { useMemo, useState } from 'react';

import { useLocale, useTranslations } from '@/i18n';
import {
  getProgramDescription,
  getProgramName,
  ProgramStatus,
  useProgramsInfinite,
  type Program,
} from '@/src/entities/program';
import { useDebouncedValue } from '@/src/shared/hooks';

import { PROGRAM_PICKER_SEARCH_DEBOUNCE_MS } from './ProgramPicker.constants';
import type { ProgramPickerProps } from './ProgramPicker.types';

/**
 * Owns the picker's search, paginated published-program list, and single
 * selection. Selection and search reset whenever the dialog closes so a later
 * open starts clean.
 */
export const useProgramPickerConfig = ({
  open,
  onOpenChange,
  onConfirm,
  onRemove,
  selectedProgramId,
  removable,
}: ProgramPickerProps) => {
  const t = useTranslations('ProgramPicker');
  const locale = useLocale();

  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(selectedProgramId ?? null);

  // The picker stays mounted while the dialog is toggled, so a `useState`
  // initializer only ever sees the first `selectedProgramId`. Re-seed the
  // highlight from the current assignment on the render where the dialog opens
  // (React's "adjust state during render" pattern), so the selection shows up
  // on first open rather than only after reopening.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setSelectedId(selectedProgramId ?? null);
  }

  const debouncedSearch = useDebouncedValue(search.trim(), PROGRAM_PICKER_SEARCH_DEBOUNCE_MS);
  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } = useProgramsInfinite(
    {
      name: debouncedSearch || undefined,
      status: [ProgramStatus.Published],
    },
    { enabled: open }
  );

  const programs = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  const reset = () => {
    setSearch('');
    setSelectedId(selectedProgramId ?? null);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleConfirm = () => {
    if (!selectedId) return;
    onConfirm(selectedId);
    onOpenChange(false);
  };

  const handleRemove = () => {
    onRemove?.();
    onOpenChange(false);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  const canConfirm = Boolean(selectedId) && selectedId !== (selectedProgramId ?? null);
  const canRemove = Boolean(onRemove) && (Boolean(selectedProgramId) || Boolean(removable));

  return {
    t,
    open,
    onOpenChange: handleOpenChange,
    search,
    onSearchChange: setSearch,
    programs,
    getName: (program: Program) => getProgramName(program, locale),
    getDescription: (program: Program) => getProgramDescription(program, locale),
    isSearching: Boolean(debouncedSearch),
    isPending,
    isFetchingNextPage,
    hasNextPage: Boolean(hasNextPage),
    onLoadMore: handleLoadMore,
    selectedId,
    onSelect: setSelectedId,
    onConfirm: handleConfirm,
    onRemove: handleRemove,
    canConfirm,
    canRemove,
  };
};
