import type { Program, ProgramCategory, ProgramDifficulty, ProgramStatus } from '../model/types';

export type ProgramSortField = 'name' | 'status' | 'category' | 'difficulty' | 'createdAt' | 'modifiedAt';

export type ProgramSortOrder = 'asc' | 'desc';

export type FetchProgramsParams = {
  name?: string;
  status?: ProgramStatus[];
  category?: ProgramCategory[];
  difficulty?: ProgramDifficulty[];
  sortBy?: ProgramSortField;
  sortOrder?: ProgramSortOrder;
};

export type FetchProgramsListParams = FetchProgramsParams;

export type ProgramsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ProgramsListResult = {
  items: Program[];
  pagination: ProgramsPagination;
};

export type CreateProgramResponse = Program;
