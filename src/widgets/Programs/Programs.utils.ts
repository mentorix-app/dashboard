import type { FetchProgramsListParams } from '@/src/entities/program';

type SearchParamsReader = {
  get: (name: string) => string | null;
};

export const parseProgramsSearchParams = (searchParams: SearchParamsReader): FetchProgramsListParams => ({
  name: searchParams.get('name')?.trim() || undefined,
});

export const createProgramsSearchParams = (
  currentSearchParams: string,
  updates: { name?: string }
): URLSearchParams => {
  const params = new URLSearchParams(currentSearchParams);
  const name = updates.name?.trim();

  if (name) {
    params.set('name', name);
  } else {
    params.delete('name');
  }

  return params;
};
