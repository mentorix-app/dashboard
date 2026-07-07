'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { GripVertical } from 'lucide-react';

import { useTranslations } from '@/i18n';
import type { ProgramDayBlock, ProgramDayExercise, ProgramDayExerciseInput } from '@/src/entities/program';
import { SortableItem, Typography } from '@/src/shared/ui';
import { cn } from '@/src/shared/lib/styles';

import { GROUP_ROW_GRID } from '../../DayExercises.constants';
import type { BlockMoveTarget } from '../../DayExercises.types';
import { CONTAINER_DND_PREFIX, EXERCISE_DND_PREFIX } from '../../lib';
import { useRenderedExercises, useSingleImportGhost } from '../../context';
import { GroupExerciseRow } from '../GroupExerciseRow';
import { RowDragHandle } from '../RowDragHandle';

type GroupBlockExercisesProps = {
  block: ProgramDayBlock;
  canEdit: boolean;
  getExerciseLabel: (exercise: ProgramDayExercise) => string;
  /** Other group blocks an exercise can be moved into. */
  moveTargets: BlockMoveTarget[];
  onUpdateExercise: (blockId: string, itemId: string, input: ProgramDayExerciseInput) => void;
  onRequestDeleteExercise: (blockId: string, itemId: string) => void;
  onExtractExercise: (blockId: string, itemId: string) => void;
  onMoveExerciseToBlock: (blockId: string, itemId: string, targetBlockId: string) => void;
};

/** Sortable, droppable list of a group's exercises; supports intra/cross-group drags. */
export const GroupBlockExercises = ({
  block,
  canEdit,
  getExerciseLabel,
  moveTargets,
  onUpdateExercise,
  onRequestDeleteExercise,
  onExtractExercise,
  onMoveExerciseToBlock,
}: GroupBlockExercisesProps) => {
  const t = useTranslations('ProgramWizard');
  const { setNodeRef } = useDroppable({ id: `${CONTAINER_DND_PREFIX}${block.id}` });
  const exercises = useRenderedExercises(block);
  const importGhost = useSingleImportGhost(block);
  const exerciseDndIds = exercises.map((exercise) => `${EXERCISE_DND_PREFIX}${exercise.id}`);

  return (
    <div ref={setNodeRef} className="flex flex-col gap-1">
      <SortableContext items={exerciseDndIds} strategy={verticalListSortingStrategy}>
        {exercises.map((exercise) => (
          <SortableItem
            key={exercise.id}
            id={`${EXERCISE_DND_PREFIX}${exercise.id}`}
            className={cn(GROUP_ROW_GRID, 'rounded-md px-1 py-1')}
          >
            <GroupExerciseRow
              block={block}
              exercise={exercise}
              exerciseName={getExerciseLabel(exercise)}
              canEdit={canEdit}
              dragHandle={<RowDragHandle canEdit={canEdit} label={t('structure.exercises.reorderExercise')} />}
              moveTargets={moveTargets}
              onUpdate={(itemId, input) => onUpdateExercise(block.id, itemId, input)}
              onRequestDelete={onRequestDeleteExercise}
              onExtract={onExtractExercise}
              onMoveToBlock={onMoveExerciseToBlock}
            />
          </SortableItem>
        ))}
      </SortableContext>
      {importGhost ? (
        <div className="flex items-center gap-2 rounded-md border border-dashed px-2 py-1 opacity-70">
          <GripVertical className="text-muted-foreground size-4" />
          <Typography variant="p-sm" className="truncate">
            {getExerciseLabel(importGhost)}
          </Typography>
        </div>
      ) : null}
    </div>
  );
};
