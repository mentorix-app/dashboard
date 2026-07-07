import type { ProgramBlockGroupType, ProgramDayBlock } from '@/src/entities/program';

export type BlockEditValue = {
  blockType: ProgramBlockGroupType;
  instruction: string;
};

export type BlockEditDialogProps = {
  block: ProgramDayBlock;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (blockId: string, value: BlockEditValue) => void;
};
