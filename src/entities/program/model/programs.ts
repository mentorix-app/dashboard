import type { Difficulty } from '@/src/shared/types';

import type { ProgramDetail } from './structure';
import type { Program, ProgramCategory, ProgramStatus } from './types';

export type ProgramSortField = 'name' | 'status' | 'category' | 'difficulty' | 'createdAt' | 'modifiedAt';

export type ProgramSortOrder = 'asc' | 'desc';

export type FetchProgramsParams = {
  name?: string;
  status?: ProgramStatus[];
  category?: ProgramCategory[];
  difficulty?: Difficulty[];
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

export type CreateProgramResponse = ProgramDetail;

export type UpdateProgramParams = Partial<{
  name: string;
  nameRu: string;
  description: string;
  descriptionRu: string;
  category: ProgramCategory;
  difficulty: Difficulty;
  previewImageUrl: string;
}>;

export type UpdateProgramVariables = {
  id: string;
  params: UpdateProgramParams;
};

export type UpdateProgramResponse = ProgramDetail;

export type PublishProgramResponse = ProgramDetail;

export type ArchiveProgramResponse = ProgramDetail;

export type PublishProgramUpdateResponse = ProgramDetail;
