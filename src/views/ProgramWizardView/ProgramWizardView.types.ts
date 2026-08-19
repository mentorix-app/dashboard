import type { ReactNode } from 'react';

export type ProgramWizardStep = 'basics' | 'structure';

export type ProgramRequiredField = 'name' | 'nameRu' | 'description' | 'descriptionRu' | 'category' | 'difficulty';

export type StructureErrorKey = 'weekWithoutExercises' | 'dayWithoutSharedBlock';

export type ProgramWizardViewProps = {
  programId: string;
  children: ReactNode;
};
