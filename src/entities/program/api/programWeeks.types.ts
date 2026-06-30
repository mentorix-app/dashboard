import type { ProgramDetail } from '../model/structure.types';

export type AddProgramWeekVariables = {
  programId: string;
};

export type ReorderProgramWeeksVariables = {
  programId: string;
  weekIds: string[];
};

export type DeleteProgramWeekVariables = {
  programId: string;
  weekId: string;
};

export type AddProgramWeekResponse = ProgramDetail;
export type ReorderProgramWeeksResponse = ProgramDetail;
export type DeleteProgramWeekResponse = ProgramDetail;
