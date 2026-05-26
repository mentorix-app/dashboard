'use client';

import { Plus, Search } from 'lucide-react';
import { type FC } from 'react';
import { useTranslations } from '@/i18n';

import { Button, Input } from '@/src/shared/ui';

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  onCreateNew: () => void;
};

export const ExercisesToolbar: FC<Props> = ({ search, onSearchChange, onCreateNew }) => {
  const t = useTranslations('Exercises');

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        <Search
          aria-hidden
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        />
        <Input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t('searchPlaceholder')}
          aria-label={t('searchPlaceholder')}
          className="pl-9"
        />
      </div>
      <Button type="button" onClick={onCreateNew} className="self-start sm:self-auto">
        <Plus aria-hidden />
        {t('createNew')}
      </Button>
    </div>
  );
};
