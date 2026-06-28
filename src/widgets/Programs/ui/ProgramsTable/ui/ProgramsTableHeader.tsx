'use client';

import { type FC } from 'react';
import { useTranslations } from '@/i18n';
import { TableHead, TableHeader, TableRow } from '@/src/shared/ui';

import { TABLE_COLUMNS } from '../ProgramsTable.constants';

export const ProgramsTableHeader: FC = () => {
  const t = useTranslations('Programs');

  return (
    <TableHeader>
      <TableRow>
        {TABLE_COLUMNS.map((field) => (
          <TableHead key={field} className={field === 'name' ? 'min-w-64' : undefined}>
            <span className="px-2 font-medium">{t(`columns.${field}`)}</span>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};
