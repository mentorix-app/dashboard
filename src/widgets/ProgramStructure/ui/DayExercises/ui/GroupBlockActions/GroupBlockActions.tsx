'use client';

import { MoreVertical, Pencil, Trash2, Ungroup } from 'lucide-react';

import { useTranslations } from '@/i18n';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/shared/ui';

import type { MoveTargetDay } from '../../DayExercises.types';

type GroupBlockActionsProps = {
  dayMoveTargets: MoveTargetDay[];
  onEdit: () => void;
  onMoveToDay: (targetDayId: string) => void;
  onUngroup: () => void;
  onDelete: () => void;
};

/** The overflow menu for a group block: edit, move to another day, ungroup, delete. */
export const GroupBlockActions = ({
  dayMoveTargets,
  onEdit,
  onMoveToDay,
  onUngroup,
  onDelete,
}: GroupBlockActionsProps) => {
  const t = useTranslations('ProgramWizard');

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon-sm" aria-label={t('structure.blocks.blockActions')}>
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="size-4" />
          {t('structure.blocks.editBlock')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {dayMoveTargets.length > 0 ? (
          <>
            <DropdownMenuLabel>{t('structure.blocks.moveBlockToDay')}</DropdownMenuLabel>
            {dayMoveTargets.map((target) => (
              <DropdownMenuItem key={target.id} onClick={() => onMoveToDay(target.id)}>
                {target.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        ) : null}
        <DropdownMenuItem onClick={onUngroup}>
          <Ungroup className="size-4" />
          {t('structure.blocks.ungroup')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          <Trash2 className="size-4" />
          {t('structure.blocks.deleteBlock')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
