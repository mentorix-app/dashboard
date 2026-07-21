import { ClientTraining } from '@/src/widgets/ClientTraining';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function UserTrainingPage({ params }: Props) {
  const { id } = await params;
  return <ClientTraining clientUserId={id} />;
}
