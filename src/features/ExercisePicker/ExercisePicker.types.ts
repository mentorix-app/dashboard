export type ExercisePickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Receives the chosen exercise ids (1–10) when the user confirms. */
  onConfirm: (exerciseIds: string[]) => void;
};
