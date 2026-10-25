'use client';

import { useId } from 'react';
import { Check } from 'lucide-react';

import { useTranslations } from '@/i18n';
import { cn } from '@/src/shared/lib/styles';
import { Typography } from '@/src/shared/ui';

import type { CopyTargetDay } from '../CopyBlockDialog.types';

type CopyDayOptionsProps = {
  days: CopyTargetDay[];
  selectedDayId: string | null;
  disabled: boolean;
  onSelect: (dayId: string) => void;
};

/**
 * Day picker as a grid of radio cards. Native radios keep arrow-key navigation
 * and screen-reader semantics; the card shows the day and what it holds.
 */
export const CopyDayOptions = ({ days, selectedDayId, disabled, onSelect }: CopyDayOptionsProps) => {
  const t = useTranslations('ProgramWizard');
  const name = useId();

  const caption = (day: CopyTargetDay) => {
    if (day.isSource) return t('structure.blocks.copyDialog.currentDay');
    if (day.blockCount === 0) return t('structure.blocks.copyDialog.restDay');
    return t('structure.blocks.copyDialog.blockCount', { count: day.blockCount });
  };

  return (
    <fieldset className="grid gap-2" disabled={disabled}>
      <legend className="mb-2 text-sm leading-none font-medium">{t('structure.blocks.copyDialog.dayLabel')}</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {days.map((day) => {
          const isSelected = day.id === selectedDayId;
          return (
            <label key={day.id} className="group relative cursor-pointer has-[:disabled]:cursor-not-allowed">
              <input
                type="radio"
                name={name}
                value={day.id}
                checked={isSelected}
                onChange={() => onSelect(day.id)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  'bg-background flex h-full min-h-14 flex-col justify-center gap-0.5 rounded-lg border px-3 py-2 transition-colors',
                  'hover:bg-muted/60 peer-focus-visible:ring-ring/50 peer-focus-visible:ring-[3px]',
                  'peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:ring-primary peer-checked:ring-1',
                  'peer-disabled:opacity-60'
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <Typography as="span" variant="p-sm" className="font-medium">
                    {t('structure.dayLabel', { number: day.dayNumber })}
                  </Typography>
                  {isSelected ? <Check aria-hidden="true" className="text-primary size-4 shrink-0" /> : null}
                </span>
                <Typography
                  as="span"
                  variant="p-xs"
                  className={cn('text-muted-foreground', day.isSource && 'text-primary font-medium')}
                >
                  {caption(day)}
                </Typography>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};
