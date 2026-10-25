import { getBlockSettings, getBlockTypeRule } from '@/src/entities/program/model/blockSettings';
import {
  DEFAULT_GROUP_BLOCK_TYPE,
  GROUP_BLOCK_TYPES,
  type ProgramBlockGroupType,
  type ProgramBlockSettings,
  type ProgramDayBlock,
} from '@/src/entities/program/model/structure';

import { getBlockVisibilityErrorMessageKey } from '../BlockVisibilityFields/BlockVisibilityFields.utils';
import type { BlockEditValue } from './BlockEditDialog.types';

/** Error key for a failed save of the block itself (type, instruction, settings), not of its visibility. */
export const BLOCK_UPDATE_FAILED = 'blockUpdateFailed';

export const getBlockEditErrorMessageKey = (errorKey: string) =>
  errorKey === BLOCK_UPDATE_FAILED
    ? 'structure.blocks.toast.blockUpdateError'
    : getBlockVisibilityErrorMessageKey(errorKey);

/** Coerce an arbitrary block-type string into a valid group type (default: the merge default, skill work). */
export const toGroupType = (value: string): ProgramBlockGroupType =>
  GROUP_BLOCK_TYPES.find((type) => type === value) ?? DEFAULT_GROUP_BLOCK_TYPE;

/** Settings the resulting type takes, each as a number or null (clear); others are omitted so the API resets them. */
const pickTypeSettings = (value: BlockEditValue): Partial<ProgramBlockSettings> =>
  getBlockTypeRule(value.blockType).fields.reduce<Partial<ProgramBlockSettings>>(
    (settings, field) => ({ ...settings, [field]: value.settings[field] }),
    {}
  );

/** PATCH body for a saved form: type, instruction and the resulting type's settings. */
export const buildBlockPatch = (value: BlockEditValue) => ({
  blockType: value.blockType,
  instruction: value.instruction,
  ...pickTypeSettings(value),
});

/** True when the form changes the block's type, instruction or any setting its (new) type takes. */
export const hasBlockChanges = (block: ProgramDayBlock, value: BlockEditValue): boolean => {
  if (value.blockType !== block.blockType || value.instruction !== block.instruction) return true;
  const current = getBlockSettings(block);
  return getBlockTypeRule(value.blockType).fields.some((field) => value.settings[field] !== current[field]);
};
