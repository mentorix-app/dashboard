import { resolveBlockType } from '@/src/entities/program/model/blockSettings';

import { BLOCK_TYPE_LABEL_KEY, UNKNOWN_BLOCK_TYPE_LABEL_KEY } from '../DayExercises.constants';

/**
 * Message key for a block type label. A removed type reads as the type the
 * migration turns it into; anything else unknown falls back to a neutral "Block".
 */
export const getBlockTypeLabelKey = (blockType: string) => {
  const resolved = resolveBlockType(blockType);
  return resolved ? BLOCK_TYPE_LABEL_KEY[resolved] : UNKNOWN_BLOCK_TYPE_LABEL_KEY;
};
