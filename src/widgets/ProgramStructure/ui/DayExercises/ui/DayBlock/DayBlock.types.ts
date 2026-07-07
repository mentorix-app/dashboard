import type { ProgramDayBlock, ProgramDayExercise, ProgramDayExerciseInput } from '@/src/entities/program';

import type { BlockMoveTarget, MoveTargetDay } from '../../DayExercises.types';
import type { BlockEditValue } from '../BlockEditDialog';

export type DayBlockProps = {
  block: ProgramDayBlock;
  canEdit: boolean;
  getExerciseLabel: (exercise: ProgramDayExercise) => string;
  /** Single blocks currently selected for a merge. */
  selectedBlockIds: Set<string>;
  /** Group blocks in the day an exercise can be moved into. */
  exerciseMoveTargets: BlockMoveTarget[];
  /** Other days a block can be moved to. */
  dayMoveTargets: MoveTargetDay[];
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
