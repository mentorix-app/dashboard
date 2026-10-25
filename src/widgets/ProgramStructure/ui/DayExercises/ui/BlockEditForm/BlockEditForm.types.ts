import type { ProgramBlockDurationField, ProgramBlockGroupType, ProgramDayBlock } from '@/src/entities/program';

import type { BlockEditValue } from '../BlockEditDialog/BlockEditDialog.types';
import type { BlockVisibilityConfig } from '../../hooks/useBlockVisibilityConfig';

/** Raw text of a time setting, entered as separate minutes and seconds. */
export type DurationInput = { minutes: string; seconds: string };

export type BlockEditFormValues = Record<ProgramBlockDurationField, DurationInput> & {
  blockType: ProgramBlockGroupType;
  instruction: string;
  rounds: string;
};

export type BlockEditFormProps = {
  block: ProgramDayBlock;
  visibility: BlockVisibilityConfig;
  isPending: boolean;
  errorKey: string | null;
  metadataSaved: boolean;
  onSubmit: (value: BlockEditValue) => Promise<void>;
  onCancel: () => void;
};
