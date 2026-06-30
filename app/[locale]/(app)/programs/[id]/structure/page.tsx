import { ProgramStructureView } from '@/src/views/ProgramStructureView';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function ProgramStructurePage({ params }: Props) {
  const { id } = await params;
  return <ProgramStructureView programId={id} />;
}
