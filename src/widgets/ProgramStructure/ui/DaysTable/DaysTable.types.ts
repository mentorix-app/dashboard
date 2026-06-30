import type { ProgramWeek } from '@/src/entities/program';

export type DaysTableProps = {
  programId: string;
  isDraft: boolean;
  weeks: ProgramWeek[];
  week: ProgramWeek;
};
