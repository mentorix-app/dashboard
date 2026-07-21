'use client';

import { type FC } from 'react';

import { useLocale, useTranslations } from '@/i18n';
import { formatDate } from '@/src/shared/lib';
import { cn } from '@/src/shared/lib/styles';
import { Button, Typography } from '@/src/shared/ui';

import type { ClientTrainingConfig } from '../ClientTraining.types';
import { pickText } from '../ClientTraining.utils';

type CompletionListProps = {
  config: ClientTrainingConfig;
};

export const CompletionList: FC<CompletionListProps> = ({ config }) => {
  const t = useTranslations('ClientProfile');
  const locale = useLocale();
  const { completions, selected, onSelect, hasMore, isFetchingMore, onLoadMore } = config;

  if (completions.length === 0) {
    return <p className="text-muted-foreground p-4 text-center text-sm">{t('history.empty')}</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <ul className="scrollbar-slim flex max-h-128 flex-col gap-1.5 overflow-y-auto pr-1.5">
        {completions.map((completion) => {
          const isActive = completion.id === selected?.id;
          return (
            <li key={completion.id}>
              <button
                type="button"
                onClick={() => onSelect(completion)}
                aria-current={isActive}
                className={cn(
                  'hover:bg-muted flex w-full flex-col gap-0.5 rounded-md border p-3 text-left transition-colors',
                  isActive ? 'border-primary bg-muted' : 'border-transparent'
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <Typography variant="p-sm" className="font-medium">
                    {t('detail.weekDay', { week: completion.weekNumber, day: completion.dayNumber })}
                  </Typography>
                  <span className="text-muted-foreground text-xs tabular-nums">
                    {formatDate(completion.completedAt, locale, 'shortDate')}
                  </span>
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {pickText(locale, completion.programName, completion.programNameRu)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {hasMore ? (
        <Button variant="outline" size="sm" onClick={onLoadMore} disabled={isFetchingMore} className="w-full">
          {t('history.loadMore')}
        </Button>
      ) : null}
    </div>
  );
};
