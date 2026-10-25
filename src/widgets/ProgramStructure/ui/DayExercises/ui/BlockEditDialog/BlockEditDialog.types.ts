import type { ProgramBlockGroupType, ProgramBlockSettings, ProgramDayBlock } from '@/src/entities/program';

/**
 * Parsed output of the block form. `settings` holds the numbers entered for the
 * resulting type's fields; every other setting is null.
 */
export type BlockEditValue = {
  blockType: ProgramBlockGroupType;
  instruction: string;
  settings: ProgramBlockSettings;
};

export type BlockEditDialogProps = {
  programId: string;
  weekId: string;
  block: ProgramDayBlock;
  isLastSharedBlock: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
