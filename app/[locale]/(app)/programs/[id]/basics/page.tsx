import { ProgramBasicsView } from '@/src/views/ProgramBasicsView';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function ProgramBasicsPage({ params }: Props) {
  const { id } = await params;
  return <ProgramBasicsView programId={id} />;
}
