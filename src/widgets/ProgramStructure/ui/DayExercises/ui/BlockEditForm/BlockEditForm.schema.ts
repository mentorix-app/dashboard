import { z } from 'zod';

import { BLOCK_SETTING_FIELDS, getBlockTypeRule, isDurationSetting } from '@/src/entities/program/model/blockSettings';
import {
  GROUP_BLOCK_TYPES,
  type ProgramBlockSettingField,
  type ProgramBlockSettings,
} from '@/src/entities/program/model/structure';

import type { BlockEditValue } from '../BlockEditDialog/BlockEditDialog.types';
import type { BlockEditFormValues } from './BlockEditForm.types';
import { parseSettingInput, type SettingParseResult } from './BlockEditForm.utils';

export type BlockEditValidationMessages = {
  required: string;
  /** Rounds that are not a whole number or are out of bounds. */
  rounds: string;
  /** Minutes or seconds that are not whole numbers. */
  durationFormat: string;
  durationRange: string;
  restRange: string;
};

const settingError = (
  field: ProgramBlockSettingField,
  result: SettingParseResult,
  required: boolean,
  messages: BlockEditValidationMessages
): string | null => {
  if (result.ok) return result.value === null && required ? messages.required : null;
  if (!isDurationSetting(field)) return messages.rounds;
  if (result.reason === 'format') return messages.durationFormat;
  return field === 'restSec' ? messages.restRange : messages.durationRange;
};

const toSettings = (values: BlockEditFormValues, fields: readonly ProgramBlockSettingField[]) =>
  BLOCK_SETTING_FIELDS.reduce<ProgramBlockSettings>(
    (settings, field) => {
      const result = parseSettingInput(values, field);
      return { ...settings, [field]: fields.includes(field) && result.ok ? result.value : null };
    },
    { rounds: null, durationSec: null, timeCapSec: null, workSec: null, restSec: null }
  );

const durationInput = z.object({ minutes: z.string(), seconds: z.string() });

/**
 * Block form schema. Only the settings the selected type takes are validated
 * (required ones must be filled, all must be in bounds); the output carries
 * them as numbers (times in seconds) and every other setting as null.
 */
export const createBlockEditSchema = (messages: BlockEditValidationMessages) =>
  z
    .object({
      blockType: z.enum(GROUP_BLOCK_TYPES),
      instruction: z.string().trim(),
      rounds: z.string(),
      durationSec: durationInput,
      timeCapSec: durationInput,
      workSec: durationInput,
      restSec: durationInput,
    })
    .superRefine((values, ctx) => {
      const rule = getBlockTypeRule(values.blockType);
      rule.fields.forEach((field) => {
        const result = parseSettingInput(values, field);
        const message = settingError(field, result, rule.required.includes(field), messages);
        if (message) ctx.addIssue({ code: 'custom', path: [field], message });
      });
    })
    .transform(
      (values): BlockEditValue => ({
        blockType: values.blockType,
        instruction: values.instruction,
        settings: toSettings(values, getBlockTypeRule(values.blockType).fields),
      })
    );
