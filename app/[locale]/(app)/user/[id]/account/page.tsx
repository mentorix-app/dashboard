import { isDeleteAccountErrorCode } from '@/src/entities/auth';
import { AccountSettings } from '@/src/widgets/AccountSettings';

type Props = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ deleteError?: string | string[] }>;
};

export default async function UserAccountPage({ searchParams }: Props) {
  const { deleteError } = await searchParams;
  return <AccountSettings initialError={isDeleteAccountErrorCode(deleteError) ? deleteError : undefined} />;
}
