'use client';

import type { ProgramAnalyticsCardVM } from '../ProgramsAnalytics.types';
import { ProgramAnalyticsCard } from './ProgramAnalyticsCard';

type ProgramsAnalyticsGridProps = {
  cards: ProgramAnalyticsCardVM[];
};

export const ProgramsAnalyticsGrid = ({ cards }: ProgramsAnalyticsGridProps) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {cards.map((card) => (
      <ProgramAnalyticsCard key={card.programId} card={card} />
    ))}
  </div>
);
