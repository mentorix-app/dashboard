'use client';

import { Check, Loader2 } from 'lucide-react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Typography,
} from '@/src/shared/ui';
import { cn } from '@/src/shared/lib/styles';

import { useProgramPickerConfig } from './ProgramPicker.conf';
import type { ProgramPickerProps } from './ProgramPicker.types';

export const ProgramPicker = (props: ProgramPickerProps) => {
  const {
    t,
    open,
    onOpenChange,
    search,
    onSearchChange,
    programs,
    getName,
    getDescription,
    isSearching,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    onLoadMore,
    selectedId,
    onSelect,
    isOwnProgram,
    onConfirm,
    onRemove,
    canConfirm,
    canRemove,
  } = useProgramPickerConfig(props);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col gap-4">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        {props.notice ? <div>{props.notice}</div> : null}

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
          ) : programs.length === 0 ? (
            <div className="flex h-48 flex-1 items-center justify-center p-6">
              <Typography variant="p-sm" className="text-muted-foreground text-center">
                {isSearching ? t('emptySearch') : t('empty')}
              </Typography>
            </div>
          ) : (
            <TooltipProvider>
              <ul role="radiogroup" className="divide-border flex-1 divide-y overflow-y-auto">
                {programs.map((program) => {
                  const checked = selectedId === program.id;
                  const disabled = !isOwnProgram(program);

                  const row = (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={checked}
                      aria-disabled={disabled || undefined}
                      onClick={disabled ? undefined : () => onSelect(program)}
                      className={cn(
                        'flex w-full items-center gap-3 px-3 py-2.5 text-left',
                        disabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-muted/60',
                        checked && 'bg-muted/60'
                      )}
                    >
                      <span
                        className={cn(
                          'flex size-5 shrink-0 items-center justify-center rounded-full border',
                          checked ? 'border-primary bg-primary text-primary-foreground' : 'border-input'
                        )}
                      >
                        {checked ? <Check className="size-3.5" /> : null}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <Typography variant="p-sm" className="truncate font-medium">
                          {getName(program)}
                        </Typography>
                        {getDescription(program) ? (
                          <Typography variant="p-xs" className="text-muted-foreground line-clamp-2">
                            {getDescription(program)}
                          </Typography>
                        ) : null}
                      </span>
                      <Typography
                        variant="p-xs"
                        className="text-muted-foreground max-w-[40%] shrink-0 truncate text-right"
                      >
                        {t('createdBy', { name: program.createdByName || program.createdBy })}
                      </Typography>
                    </button>
                  );

                  return (
                    <li key={program.id}>
                      {disabled ? (
                        <Tooltip>
                          <TooltipTrigger asChild>{row}</TooltipTrigger>
                          <TooltipContent>{t('notOwned')}</TooltipContent>
                        </Tooltip>
                      ) : (
                        row
                      )}
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
            </TooltipProvider>
          )}
        </div>

        <DialogFooter className="sm:items-center sm:justify-between">
          {canRemove ? (
            <Button type="button" variant="ghost" onClick={onRemove}>
              {t('remove')}
            </Button>
          ) : (
            <span />
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('cancel')}
            </Button>
            <Button type="button" onClick={onConfirm} disabled={!canConfirm}>
              {t('confirm')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
