import type { ProgramDayBlock, ProgramDayExercise } from '@/src/entities/program';

export type CopyBlockDialogProps = {
  programId: string;
  /** Week and day the block currently sits in. */
  sourceWeekId: string;
  sourceDayId: string;
  /** Block to copy; the dialog renders nothing without one. */
  block: ProgramDayBlock | null;
  open: boolean;
  getExerciseLabel: (exercise: ProgramDayExercise) => string;
  onOpenChange: (open: boolean) => void;
  /** Performs the copy and shows its toast; resolves to whether it succeeded. */
  onCopy: (blockId: string, targetDayId: string, successMessage: string) => Promise<boolean>;
};

export type CopyBlockFormProps = Omit<CopyBlockDialogProps, 'block' | 'open' | 'onOpenChange'> & {
  block: ProgramDayBlock;
  onPendingChange: (pending: boolean) => void;
  onClose: () => void;
};

export type CopyTargetDay = {
  id: string;
  dayNumber: number;
  blockCount: number;
  /** Whether the day already holds a block visible to every client. */
  hasSharedBlock: boolean;
  isSource: boolean;
};

export type CopyTargetWeek = {
  id: string;
  weekNumber: number;
  isSource: boolean;
  days: CopyTargetDay[];
};
