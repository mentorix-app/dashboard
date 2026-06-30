'use client';

import { ProgramStructure } from '@/src/widgets/ProgramStructure';

type ProgramStructureViewProps = {
  programId: string;
};

export const ProgramStructureView = ({ programId }: ProgramStructureViewProps) => (
  <ProgramStructure programId={programId} />
);
