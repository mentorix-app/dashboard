'use client';

import { useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';

import { useTranslations } from '@/i18n';
import { Button, Sortable, Typography } from '@/src/shared/ui';

import { WeekItem } from '../WeekItem';
import type { WeeksSidebarProps } from './WeeksSidebar.types';
import { reverseWeekOrder } from './WeeksSidebar.utils';

export const WeeksSidebar = ({
  weeks,
  selectedWeekId,
  canEdit,
  canAddWeek,
  isBusy,
  onSelectWeek,
  onDeleteWeek,
  onReorderWeeks,
  onAddWeek,
}: WeeksSidebarProps) => {
  const t = useTranslations('ProgramWizard');
  const listRef = useRef<HTMLUListElement>(null);
  const selectedWeekRef = useRef<HTMLLIElement>(null);
  const displayWeeks = reverseWeekOrder(weeks);
  const weekIds = displayWeeks.map((week) => week.id);

  useEffect(() => {
    const list = listRef.current;
    const selectedWeek = selectedWeekRef.current;

    if (!list || !selectedWeek || list.scrollHeight <= list.clientHeight) return;

    selectedWeek.scrollIntoView({ block: 'nearest' });
  }, [selectedWeekId, weeks]);

  const handleReorderWeeks = (reorderedWeekIds: string[]) => {
    onReorderWeeks(reverseWeekOrder(reorderedWeekIds));
  };

  return (
    <aside className="flex w-full flex-col gap-3 rounded-lg border p-3 lg:w-64 lg:shrink-0">
      <Typography as="h2" variant="caption" className="text-muted-foreground px-1">
        {t('structure.weeksHeading')}
      </Typography>

      <ul
        ref={listRef}
        className="scrollbar-slim flex max-h-52 flex-col gap-1 overflow-y-auto pr-1 lg:max-h-none lg:overflow-y-visible lg:pr-0"
      >
        <Sortable items={weekIds} onReorder={handleReorderWeeks}>
          {displayWeeks.map((week) => (
            <li key={week.id} ref={week.id === selectedWeekId ? selectedWeekRef : undefined}>
              <WeekItem
                id={week.id}
                label={t('structure.weekLabel', { number: week.weekNumber })}
                selectLabel={t('structure.selectWeek', { number: week.weekNumber })}
                deleteLabel={t('structure.deleteWeek', { number: week.weekNumber })}
                reorderLabel={t('structure.reorderWeek', { number: week.weekNumber })}
                isSelected={week.id === selectedWeekId}
                canEdit={canEdit}
                onSelect={() => onSelectWeek(week.id)}
                onDelete={() => onDeleteWeek(week.id)}
              />
            </li>
          ))}
        </Sortable>
      </ul>

      {canEdit ? (
        <Button type="button" variant="outline" onClick={onAddWeek} disabled={!canAddWeek || isBusy}>
          <Plus className="size-4" />
          {t('structure.addWeek')}
        </Button>
      ) : null}
    </aside>
  );
};
