'use client';

import { Loader2 } from 'lucide-react';

import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Typography,
} from '@/src/shared/ui';

import { useExercisePickerConfig } from './ExercisePicker.conf';
import { PICKER_ROW_GRID } from './ExercisePicker.constants';
import type { ExercisePickerProps } from './ExercisePicker.types';

export const ExercisePicker = (props: ExercisePickerProps) => {
  const {
    t,
    open,
    onOpenChange,
    search,
    onSearchChange,
    exercises,
    getName,
    getDescription,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    onLoadMore,
    isSelected,
    onToggle,
    canSelectMore,
    selectedCount,
    maxPick,
    onConfirm,
  } = useExercisePickerConfig(props);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col gap-4">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description', { max: maxPick })}</DialogDescription>
        </DialogHeader>

        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t('searchPlaceholder')}
          aria-label={t('searchPlaceholder')}
        />

        <div className="flex min-h-48 flex-1 flex-col overflow-hidden rounded-md border">
          {isPending ? (
            <div className="flex h-48 flex-1 items-center justify-center">
              <Loader2 className="text-muted-foreground size-5 animate-spin" />
            </div>
          ) : exercises.length === 0 ? (
            <div className="flex h-48 flex-1 items-center justify-center p-6">
              <Typography variant="p-sm" className="text-muted-foreground text-center">
                {t('empty')}
              </Typography>
            </div>
          ) : (
            <>
              <div className={`${PICKER_ROW_GRID} bg-muted/40 text-muted-foreground border-b px-3 py-2`}>
                <span />
                <Typography variant="p-xs" className="font-medium">
                  {t('columns.exercise')}
                </Typography>
                <Typography variant="p-xs" className="font-medium">
                  {t('columns.description')}
                </Typography>
                <Typography variant="p-xs" className="font-medium">
                  {t('columns.difficulty')}
                </Typography>
              </div>

              <ul className="divide-border flex-1 divide-y overflow-y-auto">
                {exercises.map((exercise) => {
                  const checked = isSelected(exercise.id);
                  const disabled = !checked && !canSelectMore;
                  const description = getDescription(exercise);

                  return (
                    <li key={exercise.id}>
                      <label
                        className={`${PICKER_ROW_GRID} hover:bg-muted/60 cursor-pointer px-3 py-2 ${
                          disabled ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                      >
                        <Checkbox
                          checked={checked}
                          disabled={disabled}
                          onCheckedChange={() => onToggle(exercise.id)}
                          className="mt-0.5"
                        />
                        <Typography variant="p-sm" className="min-w-0 font-medium">
                          {getName(exercise)}
                        </Typography>
                        <Typography variant="p-xs" className="text-muted-foreground line-clamp-2">
                          {description || '—'}
                        </Typography>
                        <Typography variant="p-xs" className="text-muted-foreground whitespace-nowrap">
                          {t(`difficulty.${exercise.difficulty}`)}
                        </Typography>
                      </label>
                    </li>
                  );
                })}

                {hasNextPage ? (
                  <li className="p-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={onLoadMore}
                      disabled={isFetchingNextPage}
                    >
                      {isFetchingNextPage ? <Loader2 className="size-4 animate-spin" /> : null}
                      {isFetchingNextPage ? t('loading') : t('loadMore')}
                    </Button>
                  </li>
                ) : null}
              </ul>
            </>
          )}
        </div>

        <DialogFooter className="sm:items-center sm:justify-between">
          <Typography variant="p-sm" className="text-muted-foreground">
            {t('selectedCount', { count: selectedCount, max: maxPick })}
          </Typography>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('cancel')}
            </Button>
            <Button type="button" onClick={onConfirm} disabled={selectedCount === 0}>
              {selectedCount === 0 ? t('addNone') : t('add', { count: selectedCount })}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
