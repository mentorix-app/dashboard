'use client';

import { Link, usePathname, useTranslations } from '@/i18n';
import { ROUTES } from '@/src/shared/lib';
import { cn } from '@/src/shared/lib/styles';

type DetailTabsNavProps = {
  programId: string;
};

export const DetailTabsNav = ({ programId }: DetailTabsNavProps) => {
  const t = useTranslations('ProgramWeekResults');
  const pathname = usePathname();
  const isResults = pathname.endsWith('/results');

  const tabs = [
    {
      key: 'overview',
      href: ROUTES.programAnalyticsOverview(programId),
      label: t('tabs.overview'),
      active: !isResults,
    },
    { key: 'results', href: ROUTES.programAnalyticsResults(programId), label: t('tabs.results'), active: isResults },
  ];

  return (
    <nav aria-label={t('tabs.label')} className="border-b">
      <ul className="flex items-center gap-6">
        {tabs.map((tab) => (
          <li key={tab.key}>
            <Link
              href={tab.href}
              aria-current={tab.active ? 'page' : undefined}
              className={cn(
                'focus-visible:ring-ring/50 -mb-px inline-flex items-center border-b-2 px-1 py-3 text-sm font-medium transition-colors outline-none focus-visible:ring-2',
                tab.active
                  ? 'border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground border-transparent'
              )}
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
