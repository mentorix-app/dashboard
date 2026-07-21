import { ProfileTabRedirect } from '@/src/widgets/ProfileShell';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;
  return <ProfileTabRedirect userId={id} />;
}
