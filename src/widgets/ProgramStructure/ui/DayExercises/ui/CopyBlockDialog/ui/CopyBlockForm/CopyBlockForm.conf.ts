'use client';

import { useState } from 'react';

import { useTranslations } from '@/i18n';
import { useProgram } from '@/src/entities/program';

import type { CopyBlockFormProps } from '../../CopyBlockDialog.types';
import { buildCopyTargets, needsSharedBlockWarning } from '../../CopyBlockDialog.utils';

/**
 * Week/day choice for a block copy. Starts on the source week with no day
 * picked; changing the week clears the day. Targets come from the cached
 * program tree, so every week is available without extra requests.
 */
export const useCopyBlockFormConfig = ({
  programId,
  sourceWeekId,
  sourceDayId,
  block,
  onCopy,
  onPendingChange,
  onClose,
}: CopyBlockFormProps) => {
  const t = useTranslations('ProgramWizard');
  const { data: program } = useProgram(programId);
  const weeks = buildCopyTargets(program?.weeks ?? [], sourceWeekId, sourceDayId);

  const [weekId, setWeekId] = useState(sourceWeekId);
  const [dayId, setDayId] = useState<string | null>(null);
  const [isPending, setPending] = useState(false);

  const selectedWeek = weeks.find((week) => week.id === weekId) ?? null;
  const selectedDay = selectedWeek?.days.find((day) => day.id === dayId) ?? null;

  const handleWeekChange = (nextWeekId: string) => {
    setWeekId(nextWeekId);
    setDayId(null);
  };

  const updatePending = (pending: boolean) => {
    setPending(pending);
    onPendingChange(pending);
  };

  const handleSubmit = async () => {
    if (!selectedWeek || !selectedDay || isPending) return;
    const successMessage = selectedDay.isSource
      ? t('structure.blocks.toast.blockCopiedSameDay')
      : t('structure.blocks.toast.blockCopied', { week: selectedWeek.weekNumber, day: selectedDay.dayNumber });

    updatePending(true);
    const copied = await onCopy(block.id, selectedDay.id, successMessage);
    updatePending(false);
    if (copied) onClose();
  };

  return {
    weeks,
    selectedWeek,
    selectedDay,
    isPending,
    restrictedClientCount: block.clientUserIds.length,
    showSharedBlockWarning: needsSharedBlockWarning(block, selectedDay),
    handleWeekChange,
    handleDaySelect: setDayId,
    handleSubmit,
  };
};
