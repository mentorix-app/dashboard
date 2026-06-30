'use client';

import { Plus } from 'lucide-react';

import { useTranslations } from '@/i18n';
import { Button, Sortable, Typography } from '@/src/shared/ui';

import { WeekItem } from '../WeekItem';
import type { WeeksSidebarProps } from './WeeksSidebar.types';

export const WeeksSidebar = ({
  weeks,
  selectedWeekId,
  canAddWeek,
  isBusy,
  onSelectWeek,
  onDeleteWeek,
  onReorderWeeks,
  onAddWeek,
}: WeeksSidebarProps) => {
  const t = useTranslations('ProgramWizard');
  const weekIds = weeks.map((week) => week.id);

  return (
    <aside className="flex w-full flex-col gap-3 lg:w-64 lg:shrink-0">
      <Typography as="h2" variant="caption" className="text-muted-foreground px-1">
        {t('structure.weeksHeading')}
      </Typography>

      <ul className="flex flex-col gap-1">
        <Sortable items={weekIds} onReorder={onReorderWeeks}>
          {weeks.map((week) => (
            <li key={week.id}>
              <WeekItem
                id={week.id}
                label={t('structure.weekLabel', { number: week.weekNumber })}
                selectLabel={t('structure.selectWeek', { number: week.weekNumber })}
                deleteLabel={t('structure.deleteWeek', { number: week.weekNumber })}
                reorderLabel={t('structure.reorderWeek', { number: week.weekNumber })}
                isSelected={week.id === selectedWeekId}
                onSelect={() => onSelectWeek(week.id)}
                onDelete={() => onDeleteWeek(week.id)}
              />
            </li>
          ))}
        </Sortable>
      </ul>

      <Button type="button" variant="outline" onClick={onAddWeek} disabled={!canAddWeek || isBusy}>
        <Plus className="size-4" />
        {t('structure.addWeek')}
      </Button>
    </aside>
  );
};
