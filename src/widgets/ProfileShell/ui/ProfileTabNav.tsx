'use client';

import { type FC } from 'react';

import { Link } from '@/i18n';
import { cn } from '@/src/shared/lib/styles';

export type ProfileTab = {
  key: string;
  label: string;
  href: string;
};

type ProfileTabNavProps = {
  tabs: ProfileTab[];
  activeKey: string;
  'aria-label': string;
};

export const ProfileTabNav: FC<ProfileTabNavProps> = ({ tabs, activeKey, 'aria-label': ariaLabel }) => (
  <nav aria-label={ariaLabel} className="border-b">
    <ul className="flex items-center gap-6">
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <li key={tab.key}>
            <Link
              href={tab.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'focus-visible:ring-ring/50 -mb-px inline-flex items-center border-b-2 px-1 py-3 text-sm font-medium transition-colors outline-none focus-visible:ring-2',
                isActive
                  ? 'border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground border-transparent'
              )}
            >
              {tab.label}
            </Link>
          </li>
        );
      })}
    </ul>
  </nav>
);
