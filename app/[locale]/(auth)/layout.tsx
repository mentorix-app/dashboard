import { type ReactNode } from 'react';

import { AuthFooter } from '@/src/widgets/AuthFooter/AuthFooter';
import { HtmlLangSync } from '@/src/shared/ui';

type Props = {
  children: ReactNode;
};

const AuthLayout = ({ children }: Props) => (
  <>
    <HtmlLangSync />
    <div className="flex min-h-svh flex-col">
      <main className="flex w-full flex-1 items-center justify-center px-4 py-8">{children}</main>
      <AuthFooter />
    </div>
  </>
);

export default AuthLayout;
