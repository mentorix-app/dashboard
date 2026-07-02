import type { ProgramWeek } from '@/src/entities/program';

export type DaysTableProps = {
  programId: string;
  canEdit: boolean;
  week: ProgramWeek;
};
