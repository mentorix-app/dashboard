import type { ProgramBlockGroupType, ProgramDayBlock } from '@/src/entities/program';

export type BlockEditValue = {
  blockType: ProgramBlockGroupType;
  instruction: string;
};

export type BlockEditDialogProps = {
  programId: string;
  weekId: string;
  block: ProgramDayBlock;
  isLastSharedBlock: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
