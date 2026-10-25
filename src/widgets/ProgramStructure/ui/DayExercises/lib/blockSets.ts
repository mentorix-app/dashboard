import { blockHasSets } from '@/src/entities/program/model/blockSettings';
import type { ProgramDayBlock } from '@/src/entities/program/model/structure';

/** How many exercises of a block would lose their sets if the block became `blockType`. */
export const countExercisesLosingSets = (block: ProgramDayBlock, blockType: string): number =>
  blockHasSets(blockType) ? 0 : block.exercises.filter((exercise) => exercise.sets !== null).length;

/**
 * True when moving an exercise into the target block makes the backend clear
 * its sets: the exercise has sets and the target type carries none.
 */
export const moveDropsSets = (
  blocks: ProgramDayBlock[],
  sourceBlockId: string,
  itemId: string,
  targetBlockId: string
): boolean => {
  const exercise = blocks.find((block) => block.id === sourceBlockId)?.exercises.find((item) => item.id === itemId);
  const target = blocks.find((block) => block.id === targetBlockId);
  if (!exercise || !target || exercise.sets === null) return false;
  return !blockHasSets(target.blockType);
};
