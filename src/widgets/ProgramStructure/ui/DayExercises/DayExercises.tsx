'use client';

import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { GripVertical, Plus } from 'lucide-react';

import { ExercisePicker } from '@/src/features/ExercisePicker';
import { Button, Typography } from '@/src/shared/ui';

import { useDayExercisesConfig } from './DayExercises.conf';
import { RenderedExercisesProvider, SingleImportProvider } from './context';
import { useDayDnd } from './hooks';
import { BLOCK_DND_PREFIX } from './lib';
import type { DayExercisesProps } from './DayExercises.types';
import { DayBlock } from './ui/DayBlock';
import { MergeBar } from './ui/MergeBar';

export const DayExercises = (props: DayExercisesProps) => {
  const {
    t,
    blocks,
    canEdit,
    getExerciseLabel,
    selectedBlockIds,
    dayMoveTargets,
    exerciseMoveTargets,
    selectionCount,
    showMergeBar,
    onSelectChange,
    onClearSelection,
    onMerge,
    isPickerOpen,
    visibilityBlockId,
    lastSharedBlockId,
    onOpenVisibility,
    onVisibilityOpenChange,
    onOpenPicker,
    onPickerOpenChange,
    onConfirmAddSingles,
    onUpdateExercise,
    onRequestDeleteExercise,
    onExtractExercise,
    onMoveExerciseToBlock,
    onAddExercise,
    onPatchBlock,
    onUngroupBlock,
    onDeleteBlock,
    onMoveBlockToDay,
    onReorderBlocks,
    onReorderBlockExercises,
  } = useDayExercisesConfig(props);

  const dnd = useDayDnd({
    blocks,
    onReorderBlocks,
    onReorderBlockExercises,
    onMoveExerciseToBlock,
    onExtractExercise,
  });
  const blockDndIds = blocks.map((block) => `${BLOCK_DND_PREFIX}${block.id}`);

  return (
    <div className="@container flex min-h-48 flex-1 flex-col gap-3 p-3">
      {canEdit ? (
        <div className="flex items-center justify-end">
          <Button type="button" variant="outline" size="sm" onClick={onOpenPicker}>
            <Plus className="size-4" />
            {t('structure.exercises.addExercise')}
          </Button>
        </div>
      ) : null}

      {showMergeBar ? <MergeBar count={selectionCount} onMerge={onMerge} onClear={onClearSelection} /> : null}

      {blocks.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <Typography variant="p-sm" className="text-muted-foreground text-center">
            {t('structure.exercises.empty')}
          </Typography>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <DndContext
            sensors={dnd.sensors}
            collisionDetection={dnd.collisionDetection}
            onDragStart={dnd.handleDragStart}
            onDragOver={dnd.handleDragOver}
            onDragEnd={dnd.handleDragEnd}
            onDragCancel={dnd.handleDragCancel}
          >
            <RenderedExercisesProvider value={dnd.getBlockExercises}>
              <SingleImportProvider value={dnd.singleImport}>
                <SortableContext items={blockDndIds} strategy={verticalListSortingStrategy}>
                  <div className="flex flex-col gap-1.5">
                    {blocks.map((block) => (
                      <DayBlock
                        key={block.id}
                        programId={props.programId}
                        weekId={props.weekId}
                        block={block}
                        canEdit={canEdit}
                        getExerciseLabel={getExerciseLabel}
                        selectedBlockIds={selectedBlockIds}
                        exerciseMoveTargets={exerciseMoveTargets}
                        dayMoveTargets={dayMoveTargets}
                        onSelectChange={onSelectChange}
                        onUpdateExercise={onUpdateExercise}
                        onRequestDeleteExercise={onRequestDeleteExercise}
                        onExtractExercise={onExtractExercise}
                        onMoveExerciseToBlock={onMoveExerciseToBlock}
                        onAddExercise={onAddExercise}
                        onPatchBlock={onPatchBlock}
                        onUngroupBlock={onUngroupBlock}
                        onDeleteBlock={onDeleteBlock}
                        onMoveBlockToDay={onMoveBlockToDay}
                        isLastSharedBlock={lastSharedBlockId === block.id}
                        visibilityOpen={visibilityBlockId === block.id}
                        onOpenVisibility={() => onOpenVisibility(block.id)}
                        onVisibilityOpenChange={onVisibilityOpenChange}
                      />
                    ))}
                  </div>
                </SortableContext>
              </SingleImportProvider>
            </RenderedExercisesProvider>
            <DragOverlay>
              {dnd.activeExercise ? (
                <div className="bg-card flex items-center gap-2 rounded-md border px-2 py-1 shadow-lg">
                  <GripVertical className="text-muted-foreground size-4" />
                  <Typography variant="p-sm" className="truncate">
                    {getExerciseLabel(dnd.activeExercise)}
                  </Typography>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}

      <ExercisePicker open={isPickerOpen} onOpenChange={onPickerOpenChange} onConfirm={onConfirmAddSingles} />
    </div>
  );
};
