import type { Difficulty } from '@/src/shared/types';

export enum ProgramStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
}

export enum ProgramCategory {
  WeightLoss = 'weight_loss',
  MuscleGain = 'muscle_gain',
  Rehabilitation = 'rehabilitation',
  Endurance = 'endurance',
  Functional = 'functional',
}

export type Program = {
  id: string;
  createdBy: string;
  createdByName: string;
  modifiedBy: string;
  status: ProgramStatus;
  name: string;
  nameRu: string;
  description: string;
  descriptionRu: string;
  category: ProgramCategory | null;
  difficulty: Difficulty | null;
  previewImageUrl: string;
  createdAt: string;
  modifiedAt: string;
  deletedAt: string | null;
};

/**
 * Editable step-1 fields shared between the basics form (autosave) and the
 * wizard shell (live progress + manual save). Selects use '' for "not chosen".
 */
export type ProgramDraftFields = {
  name: string;
  nameRu: string;
  description: string;
  descriptionRu: string;
  category: ProgramCategory | '';
  difficulty: Difficulty | '';
  previewImageUrl: string;
};
