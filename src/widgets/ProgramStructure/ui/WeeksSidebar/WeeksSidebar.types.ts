import type { ProgramWeek } from '@/src/entities/program';

export type WeeksSidebarProps = {
  weeks: ProgramWeek[];
  selectedWeekId: string | null;
  canEdit: boolean;
  canAddWeek: boolean;
  isBusy: boolean;
  onSelectWeek: (weekId: string) => void;
  onDeleteWeek: (weekId: string) => void;
  onReorderWeeks: (weekIds: string[]) => void;
  onAddWeek: () => void;
};
