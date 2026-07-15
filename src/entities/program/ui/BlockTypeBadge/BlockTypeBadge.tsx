import { Badge } from '@/src/shared/ui';
import { cn } from '@/src/shared/lib/styles';

import { ProgramBlockType } from '../../model/structure';

/** Soft, per-type colors so each group block reads distinctly without shouting. */
const BLOCK_TYPE_CLASS: Record<ProgramBlockType, string> = {
  [ProgramBlockType.Single]: 'bg-muted text-muted-foreground',
  [ProgramBlockType.Emom]: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
  [ProgramBlockType.Amrap]: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  [ProgramBlockType.ForTime]: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  [ProgramBlockType.Intervals]: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
  [ProgramBlockType.Chipper]: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  [ProgramBlockType.Ladder]: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
  [ProgramBlockType.DeathBy]: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  [ProgramBlockType.Superset]: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300',
  [ProgramBlockType.Complex]: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  [ProgramBlockType.SkillWork]: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
  [ProgramBlockType.Strength]: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  [ProgramBlockType.Conditioning]: 'bg-lime-100 text-lime-700 dark:bg-lime-950 dark:text-lime-300',
  [ProgramBlockType.Gymnastics]: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
  [ProgramBlockType.Weightlifting]: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
};

type BlockTypeBadgeProps = {
  blockType: ProgramBlockType;
  label: string;
  className?: string;
};

export const BlockTypeBadge = ({ blockType, label, className }: BlockTypeBadgeProps) => (
  <Badge
    variant="outline"
    size="sm"
    className={cn('border-transparent uppercase', BLOCK_TYPE_CLASS[blockType], className)}
  >
    {label}
  </Badge>
);
