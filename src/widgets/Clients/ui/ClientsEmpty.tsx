'use client';

import { Users } from 'lucide-react';

import { useTranslations } from '@/i18n';
import { Typography } from '@/src/shared/ui';

type ClientsEmptyProps = {
  isSearching: boolean;
};

export const ClientsEmpty = ({ isSearching }: ClientsEmptyProps) => {
  const t = useTranslations('Clients');

  return (
    <div className="border-border flex flex-col items-center justify-center gap-3 rounded-md border border-dashed px-6 py-16 text-center">
      <Users className="text-muted-foreground size-8" aria-hidden />
      <Typography variant="p-sm" className="text-muted-foreground max-w-sm">
        {isSearching ? t('emptySearch') : t('empty')}
      </Typography>
    </div>
  );
};
