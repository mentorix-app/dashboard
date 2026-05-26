'use client';

import { useMemo, type FC } from 'react';
import { useTranslations } from '@/i18n';
import type { Exercise } from '@/src/entities/exercise';
import {
  Checkbox,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Typography,
} from '@/src/shared/ui';

const SKELETON_ROW_COUNT = 5;

type Props = {
  exercises: Exercise[] | undefined;
  isLoading: boolean;
  selectedIds: ReadonlySet<string>;
  onToggleRow: (id: string) => void;
  onToggleAll: (next: boolean) => void;
};

export const ExercisesTable: FC<Props> = ({ exercises, isLoading, selectedIds, onToggleRow, onToggleAll }) => {
  const t = useTranslations('Exercises');

  const allSelected = useMemo(
    () => Boolean(exercises?.length) && exercises?.every((exercise) => selectedIds.has(exercise.id)),
    [exercises, selectedIds]
  );

  const someSelected = useMemo(
    () => (exercises?.some((exercise) => selectedIds.has(exercise.id)) ?? false) && !allSelected,
    [exercises, selectedIds, allSelected]
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">
            <Checkbox
              checked={allSelected ? true : someSelected ? 'indeterminate' : false}
              onCheckedChange={(value) => onToggleAll(value === true)}
              aria-label={t('selectAll')}
              disabled={!exercises?.length}
            />
          </TableHead>
          <TableHead>{t('columns.name')}</TableHead>
          <TableHead>{t('columns.addedBy')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading
          ? Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell>
                  <Skeleton className="size-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
              </TableRow>
            ))
          : null}
        {!isLoading && exercises?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              <Typography variant="p-sm" as="span" className="text-muted-foreground">
                {t('empty')}
              </Typography>
            </TableCell>
          </TableRow>
        ) : null}
        {!isLoading
          ? exercises?.map((exercise) => {
              const isSelected = selectedIds.has(exercise.id);
              return (
                <TableRow key={exercise.id} data-state={isSelected ? 'selected' : undefined}>
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleRow(exercise.id)}
                      aria-label={t('selectRow', { name: exercise.name })}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{exercise.name}</TableCell>
                  <TableCell className="text-muted-foreground">{exercise.addedBy}</TableCell>
                </TableRow>
              );
            })
          : null}
      </TableBody>
    </Table>
  );
};
