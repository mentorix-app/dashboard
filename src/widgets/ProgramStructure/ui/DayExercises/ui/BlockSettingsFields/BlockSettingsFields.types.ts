import type { UseFormReturn } from 'react-hook-form';

import type {
  BlockTypeRule,
  ProgramBlockDurationField,
  ProgramBlockGroupType,
  ProgramBlockSettingField,
} from '@/src/entities/program';

import type { BlockEditValue } from '../BlockEditDialog/BlockEditDialog.types';
import type { BlockEditFormValues } from '../BlockEditForm/BlockEditForm.types';

export type BlockEditFormApi = UseFormReturn<BlockEditFormValues, unknown, BlockEditValue>;

export type BlockSettingsFieldsProps = {
  blockType: ProgramBlockGroupType;
  rule: BlockTypeRule;
  form: BlockEditFormApi;
  /** Exercises whose sets the save would clear (the selected type has none). */
  setsToClear: number;
  onDurationBlur: (field: ProgramBlockDurationField) => void;
};

export type BlockSettingInputProps = {
  field: ProgramBlockSettingField;
  required: boolean;
  form: BlockEditFormApi;
  onDurationBlur: (field: ProgramBlockDurationField) => void;
};

export type DurationSettingInputProps = Omit<BlockSettingInputProps, 'field'> & {
  field: ProgramBlockDurationField;
};
