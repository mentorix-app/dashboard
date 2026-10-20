import { BarChart3, Dumbbell, LayoutDashboard, Table2, Users } from 'lucide-react';
import { ROUTES } from '@/src/shared/lib';
import type { SidebarNavGroup } from './AppSidebar.types';

export const navGroups: SidebarNavGroup[] = [
  {
    id: 'main',
    i18nKey: 'groups.main',
    items: [
      { id: 'dashboard', i18nKey: 'dashboard', href: ROUTES.dashboard, icon: LayoutDashboard },
      { id: 'exercises', i18nKey: 'exercises', href: ROUTES.exercises, icon: Dumbbell, tourTarget: 'nav-exercises' },
      { id: 'programs', i18nKey: 'programs', href: ROUTES.programs, icon: Table2, tourTarget: 'nav-programs' },
      { id: 'clients', i18nKey: 'clients', href: ROUTES.clients, icon: Users, tourTarget: 'nav-clients' },
      { id: 'analytics', i18nKey: 'analytics', href: ROUTES.analytics, icon: BarChart3, tourTarget: 'nav-analytics' },
    ],
  },
];
