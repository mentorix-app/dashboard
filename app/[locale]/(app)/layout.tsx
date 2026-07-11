import { cookies } from 'next/headers';
import { type ReactNode } from 'react';

import { getSession } from '@/src/entities/auth/server/dal';
import { UserHydrator } from '@/src/entities/user';
import { HtmlLangSync, SidebarInset, SidebarProvider } from '@/src/shared/ui';
import { AppHeader } from '@/src/widgets/AppHeader/AppHeader';
import { AppSidebar } from '@/src/widgets/AppSidebar/AppSidebar';

const SIDEBAR_COOKIE = 'sidebar_state';

type Props = {
  children: ReactNode;
};

const AppLayout = async ({ children }: Props) => {
  const cookieStore = await cookies();
  const sidebarOpen = cookieStore.get(SIDEBAR_COOKIE)?.value !== 'false';
  const session = await getSession();

  return (
    <>
      <HtmlLangSync />
      <UserHydrator userId={session?.userId ?? null}>
        <SidebarProvider defaultOpen={sidebarOpen}>
          <AppSidebar />
          <SidebarInset className="min-h-dvh">
            <AppHeader />
            <main className="flex flex-1 flex-col px-[var(--app-content-px)] py-[var(--app-content-py)]">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </UserHydrator>
    </>
  );
};

export default AppLayout;
