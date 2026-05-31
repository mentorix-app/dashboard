import type { Exercise } from '@/src/entities/exercise';

export type ExercisesConfig = {
  search: string;
  exercises: Exercise[] | undefined;
  isPending: boolean;
  visibleSelected: ReadonlySet<string>;
  handleSearchChange: (value: string) => void;
  handleCreateNew: () => void;
  handleToggleRow: (id: string) => void;
  handleToggleAll: (shouldSelectAll: boolean) => void;
};
