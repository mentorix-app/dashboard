export enum ExerciseMuscleGroup {
  Compound = 'compound',
  Chest = 'chest',
  Back = 'back',
  Legs = 'legs',
  Shoulders = 'shoulders',
  Arms = 'arms',
  Core = 'core',
  FullBody = 'full_body',
}

export enum ExerciseType {
  Strength = 'strength',
  Cardio = 'cardio',
  MixedModal = 'mixed_modal',
  Intervals = 'intervals',
  Stretching = 'stretching',
  Metcon = 'metcon',
  SkillWork = 'skill_work',
  Accessory = 'accessory',
}

export enum ExerciseEquipment {
  Barbell = 'barbell',
  Dumbbells = 'dumbbells',
  Kettlebell = 'kettlebell',
  PullUpBar = 'pull_up_bar',
  SquatRack = 'squat_rack',
  RowingMachine = 'rowing_machine',
  AssaultBike = 'assault_bike',
  JumpRope = 'jump_rope',
  PlyoBox = 'plyo_box',
  MedicineBall = 'medicine_ball',
  WallBall = 'wall_ball',
  ResistanceBands = 'resistance_bands',
  BattleRopes = 'battle_ropes',
  GymnasticRings = 'gymnastic_rings',
  Sandbag = 'sandbag',
  Sled = 'sled',
  WeightPlates = 'weight_plates',
}

export enum ExerciseDifficulty {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
  Expert = 'expert',
}

export type Exercise = {
  id: string;
  name: string;
  nameRu: string;
  addedBy: string;
  modifiedBy: string;
  modifiedAt: string;
  equipment?: ExerciseEquipment;
  type: ExerciseType;
  muscleGroup: ExerciseMuscleGroup;
  description: string;
  descriptionRu: string;
  difficulty: ExerciseDifficulty;
  videoUrl: string;
  previewImageUrl: string;
};
