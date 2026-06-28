import type { FetchProgramsListParams, Program } from '@/src/entities/program';

export type ProgramsConfig = {
  search: string;
  listParams: FetchProgramsListParams;
  programs: Program[];
  isPending: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  handleSearchChange: (value: string) => void;
  handleCreateNew: () => void;
  handleLoadMore: () => void;
};

export type ProgramsSearchParamsController = {
  search: string;
  listParams: FetchProgramsListParams;
  handleSearchChange: (value: string) => void;
};
