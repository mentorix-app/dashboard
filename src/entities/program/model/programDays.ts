import type { ProgramDetail } from './structure';

export type AddProgramDayVariables = {
  programId: string;
  weekId: string;
};

export type ReorderProgramDaysVariables = {
  programId: string;
  weekId: string;
  dayIds: string[];
};

export type DeleteProgramDayVariables = {
  programId: string;
  weekId: string;
  dayId: string;
};

export type AddProgramDayResponse = ProgramDetail;
export type ReorderProgramDaysResponse = ProgramDetail;
export type DeleteProgramDayResponse = ProgramDetail;
