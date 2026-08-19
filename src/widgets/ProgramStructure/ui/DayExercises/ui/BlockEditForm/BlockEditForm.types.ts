import type { ProgramDayBlock } from '@/src/entities/program';

import type { BlockEditValue } from '../BlockEditDialog/BlockEditDialog.types';
import type { BlockVisibilityConfig } from '../../hooks/useBlockVisibilityConfig';

export type BlockEditFormProps = {
  block: ProgramDayBlock;
  visibility: BlockVisibilityConfig;
  isPending: boolean;
  errorKey: string | null;
  metadataSaved: boolean;
  onSubmit: (value: BlockEditValue) => Promise<void>;
  onCancel: () => void;
};
