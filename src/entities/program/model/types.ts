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
  modifiedBy: string;
  status: ProgramStatus;
  name: string;
  description: string;
  category: ProgramCategory | null;
  difficulty: Difficulty | null;
  previewImageUrl: string;
  createdAt: string;
  modifiedAt: string;
  deletedAt: string | null;
};
