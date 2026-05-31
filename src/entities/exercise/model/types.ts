export enum ExerciseMuscleGroup {
  Compound = 'compound',
  Chest = 'chest',
  Back = 'back',
  Legs = 'legs',
  Shoulders = 'shoulders',
  Arms = 'arms',
  Core = 'core',
  FullBody = 'full-body',
}

export enum ExerciseType {
  Strength = 'strength',
  Cardio = 'cardio',
  MixedModal = 'mixed-modal',
  Intervals = 'intervals',
  Stretching = 'stretching',
  Metcon = 'metcon',
  SkillWork = 'skill-work',
  Accessory = 'accessory',
}

export enum ExerciseEquipment {
  Barbell = 'barbell',
  Dumbbells = 'dumbbells',
  Kettlebell = 'kettlebell',
  PullUpBar = 'pull-up-bar',
  SquatRack = 'squat-rack',
  RowingMachine = 'rowing-machine',
  AssaultBike = 'assault-bike',
  JumpRope = 'jump-rope',
  PlyoBox = 'plyo-box',
  MedicineBall = 'medicine-ball',
  WallBall = 'wall-ball',
  ResistanceBands = 'resistance-bands',
  BattleRopes = 'battle-ropes',
  GymnasticRings = 'gymnastic-rings',
  Sandbag = 'sandbag',
  Sled = 'sled',
  WeightPlates = 'weight-plates',
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
