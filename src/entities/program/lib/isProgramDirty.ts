import type { Program, ProgramDraftFields } from '../model/types';

import { buildProgramPatch } from './buildProgramPatch';

export const isProgramDirty = (fields: ProgramDraftFields, program: Program): boolean =>
  Object.keys(buildProgramPatch(fields, program)).length > 0;
