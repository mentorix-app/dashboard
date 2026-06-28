/**
 * Shared difficulty scale used by exercises and programs alike. The backend
 * exposes the same `Difficulty` enum for both resources, so the frontend keeps
 * a single source of truth here instead of duplicating per-entity enums.
 */
export enum Difficulty {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
  Expert = 'expert',
}

export const DIFFICULTY_OPTIONS: readonly Difficulty[] = [
  Difficulty.Beginner,
  Difficulty.Intermediate,
  Difficulty.Advanced,
  Difficulty.Expert,
];
