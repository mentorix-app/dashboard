import type { ProgramDayBlock, ProgramDayExercise, ProgramDayExerciseInput } from '@/src/entities/program';

import type { BlockMoveTarget, MoveTargetDay } from '../../DayExercises.types';
import type { BlockEditValue } from '../BlockEditDialog';

export type GroupBlockCardProps = {
  block: ProgramDayBlock;
  canEdit: boolean;
  /** Resolves the locale-aware display name for an exercise. */
  getExerciseLabel: (exercise: ProgramDayExercise) => string;
  /** Other group blocks in the day an exercise can be moved into. */
  exerciseMoveTargets: BlockMoveTarget[];
  /** Days the whole block can be moved to. */
  dayMoveTargets: MoveTargetDay[];
  /** Whether this block is currently picked for a merge. */
  selected: boolean;
  onSelectChange: (blockId: string, checked: boolean) => void;
  onUpdateExercise: (blockId: string, itemId: string, input: ProgramDayExerciseInput) => void;
  onRequestDeleteExercise: (blockId: string, itemId: string) => void;
  onExtractExercise: (blockId: string, itemId: string) => void;
  onMoveExerciseToBlock: (blockId: string, itemId: string, targetBlockId: string) => void;
  onAddExercise: (blockId: string, exerciseIds: string[]) => void;
  onPatchBlock: (blockId: string, value: BlockEditValue) => void;
  onUngroupBlock: (blockId: string) => void;
  onDeleteBlock: (blockId: string) => void;
  onMoveBlockToDay: (blockId: string, targetDayId: string) => void;
};
