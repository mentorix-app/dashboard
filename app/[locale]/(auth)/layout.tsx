import { type ReactNode } from 'react';

import { AuthFooter } from '@/src/widgets/AuthFooter/AuthFooter';
import { HtmlLangSync } from '@/src/shared/ui';

type Props = {
  children: ReactNode;
};

const AuthLayout = ({ children }: Props) => (
  <>
    <HtmlLangSync />
    <div className="relative isolate flex min-h-svh flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_0%,color-mix(in_oklab,#38bdf8_16%,transparent),transparent),radial-gradient(40%_35%_at_85%_100%,color-mix(in_oklab,#84cc16_10%,transparent),transparent)]"
      />
      <main className="flex w-full flex-1 items-center justify-center px-4 py-8">{children}</main>
      <AuthFooter />
    </div>
  </>
);

export default AuthLayout;
