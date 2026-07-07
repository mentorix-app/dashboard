import type { ProgramDayBlock } from '@/src/entities/program';

import type { BlockEditValue } from '../BlockEditDialog/BlockEditDialog.types';

export type BlockEditFormProps = {
  block: ProgramDayBlock;
  onSubmit: (value: BlockEditValue) => void;
  onCancel: () => void;
};
