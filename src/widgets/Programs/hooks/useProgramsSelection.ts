'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Program } from '@/src/entities/program';

export const useProgramsSelection = (programs: Program[], canManageProgram: (program: Program) => boolean) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const manageablePrograms = useMemo(
    () => programs.filter((program) => canManageProgram(program)),
    [programs, canManageProgram]
  );

  const handleToggleRow = useCallback(
    (id: string) => {
      const program = programs.find((item) => item.id === id);
      if (!program || !canManageProgram(program)) return;

      setSelectedIds((current) => {
        const next = new Set(current);
        if (next.has(id)) {
          next.delete(id);
          return next;
        }

        next.add(id);
        return next;
      });
    },
    [programs, canManageProgram]
  );

  const handleToggleAllVisible = useCallback(() => {
    setSelectedIds((current) => {
      const next = new Set(current);
      const visibleIds = manageablePrograms.map((program) => program.id);
      const allSelected = visibleIds.length > 0 && visibleIds.every((id) => next.has(id));

      visibleIds.forEach((id) => {
        if (allSelected) next.delete(id);
        else next.add(id);
      });

      return next;
    });
  }, [manageablePrograms]);

  const visibleSelected = useMemo(
    () => new Set(Array.from(selectedIds).filter((id) => manageablePrograms.some((program) => program.id === id))),
    [selectedIds, manageablePrograms]
  );

  const selectedPrograms = useMemo(
    () => manageablePrograms.filter((program) => visibleSelected.has(program.id)),
    [manageablePrograms, visibleSelected]
  );

  return {
    selectedIds,
    setSelectedIds,
    visibleSelected,
    selectedPrograms,
    handleToggleRow,
    handleToggleAllVisible,
  };
};
