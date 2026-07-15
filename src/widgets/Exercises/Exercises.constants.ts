import { ExerciseEquipment, ExerciseMuscleGroup, ExerciseType } from '@/src/entities/exercise';
import type { ExerciseSortField } from '@/src/entities/exercise';
import { Difficulty } from '@/src/shared/types';

export const EXERCISE_TYPE_OPTIONS: readonly ExerciseType[] = [
  ExerciseType.Strength,
  ExerciseType.Cardio,
  ExerciseType.MixedModal,
  ExerciseType.Intervals,
  ExerciseType.Stretching,
  ExerciseType.Metcon,
  ExerciseType.SkillWork,
  ExerciseType.Accessory,
];

export const EXERCISE_MUSCLE_GROUP_OPTIONS: readonly ExerciseMuscleGroup[] = [
  ExerciseMuscleGroup.Compound,
  ExerciseMuscleGroup.Chest,
  ExerciseMuscleGroup.Back,
  ExerciseMuscleGroup.Legs,
  ExerciseMuscleGroup.Shoulders,
  ExerciseMuscleGroup.Arms,
  ExerciseMuscleGroup.Core,
  ExerciseMuscleGroup.FullBody,
];

export const EXERCISE_EQUIPMENT_OPTIONS: readonly ExerciseEquipment[] = [
  ExerciseEquipment.Barbell,
  ExerciseEquipment.Dumbbells,
  ExerciseEquipment.Kettlebell,
  ExerciseEquipment.PullUpBar,
  ExerciseEquipment.SquatRack,
  ExerciseEquipment.RowingMachine,
  ExerciseEquipment.AssaultBike,
  ExerciseEquipment.BikeErg,
  ExerciseEquipment.SkiErg,
  ExerciseEquipment.JumpRope,
  ExerciseEquipment.PlyoBox,
  ExerciseEquipment.MedicineBall,
  ExerciseEquipment.WallBall,
  ExerciseEquipment.ResistanceBands,
  ExerciseEquipment.BattleRopes,
  ExerciseEquipment.GymnasticRings,
  ExerciseEquipment.Sandbag,
  ExerciseEquipment.Sled,
  ExerciseEquipment.WeightPlates,
];

export const EXERCISE_DIFFICULTY_OPTIONS: readonly Difficulty[] = [
  Difficulty.Beginner,
  Difficulty.Intermediate,
  Difficulty.Advanced,
  Difficulty.Expert,
];

export const EXERCISE_SORT_FIELDS: readonly ExerciseSortField[] = [
  'name',
  'type',
  'muscleGroup',
  'equipment',
  'difficulty',
  'modifiedAt',
];
