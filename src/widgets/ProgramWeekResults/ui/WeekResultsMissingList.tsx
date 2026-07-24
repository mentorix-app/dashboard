'use client';

import { Link, useTranslations } from '@/i18n';
import { Avatar, AvatarFallback, AvatarImage, Typography } from '@/src/shared/ui';

import type { WeekResultsClientVM } from '../ProgramWeekResults.types';

type WeekResultsMissingListProps = {
  clients: WeekResultsClientVM[];
  description: string;
};

/** Separated, clearly grouped list of clients without results, still linked to their analytics. */
export const WeekResultsMissingList = ({ clients, description }: WeekResultsMissingListProps) => {
  const t = useTranslations('ProgramWeekResults');

  if (clients.length === 0) return null;

  return (
    <section aria-label={t('missing.heading', { count: clients.length })} className="flex flex-col gap-3 border-t pt-5">
      <div className="flex flex-col gap-0.5">
        <Typography variant="p-sm" className="font-medium">
          {t('missing.heading', { count: clients.length })}
        </Typography>
        <Typography variant="p-sm" className="text-muted-foreground text-xs">
          {description}
        </Typography>
      </div>
      <ul className="flex flex-wrap gap-2">
        {clients.map((client) => (
          <li key={client.clientUserId}>
            <Link
              href={client.href}
              className="border-border bg-muted/40 hover:bg-muted flex items-center gap-2 rounded-full border py-1 pr-3 pl-1 transition-colors"
            >
              <Avatar className="size-7">
                <AvatarImage src={client.avatarSrc} alt={client.avatarAlt} />
                <AvatarFallback className="text-xs">{client.initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{client.displayName}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
