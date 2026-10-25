'use client';

import { Copy, Loader2, TriangleAlert, Users } from 'lucide-react';

import { useTranslations } from '@/i18n';
import {
  Button,
  DialogFooter,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Typography,
} from '@/src/shared/ui';

import type { CopyBlockFormProps } from '../../CopyBlockDialog.types';
import { CopyBlockSource } from '../CopyBlockSource';
import { CopyDayOptions } from '../CopyDayOptions';
import { useCopyBlockFormConfig } from './CopyBlockForm.conf';

export const CopyBlockForm = (props: CopyBlockFormProps) => {
  const t = useTranslations('ProgramWizard');
  const config = useCopyBlockFormConfig(props);

  return (
    <>
      <div className="scrollbar-slim -mx-1 grid min-h-0 flex-1 content-start gap-5 overflow-y-auto px-1 pb-1">
        <CopyBlockSource block={props.block} getExerciseLabel={props.getExerciseLabel} />

        <div className="grid gap-2">
          <Label htmlFor="copy-block-week">{t('structure.blocks.copyDialog.weekLabel')}</Label>
          <Select
            value={config.selectedWeek?.id ?? ''}
            onValueChange={config.handleWeekChange}
            disabled={config.isPending}
          >
            <SelectTrigger id="copy-block-week" className="w-full sm:w-64">
              <SelectValue placeholder={t('structure.blocks.copyDialog.weekPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {config.weeks.map((week) => (
                <SelectItem key={week.id} value={week.id} disabled={week.days.length === 0}>
                  {t('structure.weekLabel', { number: week.weekNumber })}
                  {week.isSource ? (
                    <span className="text-muted-foreground">· {t('structure.blocks.copyDialog.currentWeek')}</span>
                  ) : null}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {config.selectedWeek ? (
          <CopyDayOptions
            days={config.selectedWeek.days}
            selectedDayId={config.selectedDay?.id ?? null}
            disabled={config.isPending}
            onSelect={config.handleDaySelect}
          />
        ) : null}

        {config.restrictedClientCount > 0 ? (
          <div className="text-muted-foreground flex items-start gap-2">
            <Users aria-hidden="true" className="size-4 shrink-0" />
            <Typography variant="p-xs" className="text-muted-foreground">
              {t('structure.blocks.copyDialog.restrictedInfo', { count: config.restrictedClientCount })}
            </Typography>
          </div>
        ) : null}

        {config.showSharedBlockWarning ? (
          <div
            role="status"
            className="flex items-start gap-2 rounded-md border border-amber-300/70 bg-amber-50 px-3 py-2 text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-200"
          >
            <TriangleAlert aria-hidden="true" className="size-4 shrink-0" />
            <Typography variant="p-xs" className="text-inherit">
              {t('structure.blocks.copyDialog.noSharedBlockWarning')}
            </Typography>
          </div>
        ) : null}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={props.onClose} disabled={config.isPending}>
          {t('structure.blocks.copyDialog.cancel')}
        </Button>
        <Button type="button" onClick={config.handleSubmit} disabled={!config.selectedDay || config.isPending}>
          {config.isPending ? (
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <Copy aria-hidden="true" className="size-4" />
          )}
          {t('structure.blocks.copyDialog.submit')}
        </Button>
      </DialogFooter>
    </>
  );
};
