import type { ProgramWeek } from '@/src/entities/program';

export type WeeksSidebarProps = {
  weeks: ProgramWeek[];
  selectedWeekId: string | null;
  canAddWeek: boolean;
  isBusy: boolean;
  onSelectWeek: (weekId: string) => void;
  onDeleteWeek: (weekId: string) => void;
  onReorderWeeks: (weekIds: string[]) => void;
  onAddWeek: () => void;
};
