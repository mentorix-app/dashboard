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

export enum ProgramDifficulty {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
  Expert = 'expert',
}

export type Program = {
  id: string;
  createdBy: string;
  modifiedBy: string;
  status: ProgramStatus;
  name: string;
  description: string;
  category: ProgramCategory | null;
  difficulty: ProgramDifficulty | null;
  previewImageUrl: string;
  createdAt: string;
  modifiedAt: string;
  deletedAt: string | null;
};
