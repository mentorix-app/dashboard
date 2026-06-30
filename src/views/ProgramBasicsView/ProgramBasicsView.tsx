import { ProgramBasicsForm } from '@/src/widgets/ProgramBasicsForm';

type ProgramBasicsViewProps = {
  programId: string;
};

export const ProgramBasicsView = ({ programId }: ProgramBasicsViewProps) => <ProgramBasicsForm programId={programId} />;
