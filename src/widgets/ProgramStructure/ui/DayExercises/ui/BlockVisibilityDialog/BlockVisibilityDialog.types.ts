import type { ProgramDayBlock } from '@/src/entities/program';

export type BlockVisibilityDialogProps = {
  programId: string;
  weekId: string;
  block: ProgramDayBlock;
  isLastSharedBlock: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
