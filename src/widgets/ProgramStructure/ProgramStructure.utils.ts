import type { ProgramWeek } from '@/src/entities/program';

/**
 * Builds a client-only week appended to the in-memory working copy used while
 * editing a published/archived program. The id is local until a real save
 * round-trip replaces it with the server's id.
 */
export const buildLocalWeek = (weeks: ProgramWeek[]): ProgramWeek => {
  const nextNumber = weeks.length + 1;

  return {
    id: crypto.randomUUID(),
    weekNumber: nextNumber,
    sortOrder: nextNumber,
    days: [],
    createdAt: new Date().toISOString(),
  };
};

/**
 * Reorders the working weeks to match the given id order and renumbers them so
 * weekNumber/sortOrder always reflect their visible position.
 */
export const reorderWeeks = (weeks: ProgramWeek[], orderedIds: string[]): ProgramWeek[] => {
  const byId = new Map(weeks.map((week) => [week.id, week]));

  return orderedIds.reduce<ProgramWeek[]>((result, id) => {
    const week = byId.get(id);
    if (week) {
      const position = result.length + 1;
      result.push({ ...week, weekNumber: position, sortOrder: position });
    }
    return result;
  }, []);
};
