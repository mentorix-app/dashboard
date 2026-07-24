export type CompletionFeedbackCommentVM = {
  id: string;
  text: string;
  createdAtLabel: string;
};

/** The completed workout day a trainer is reviewing/replying to. */
export type CompletionFeedbackTarget = {
  clientUserId: string;
  displayName: string;
  dayNumber: number;
  /** Null when the client has no result for this day (no reply possible). */
  completionId: string | null;
  resultText: string;
  completedAtLabel: string | null;
  comments: CompletionFeedbackCommentVM[];
};

export type CompletionFeedbackDialogProps = {
  /** Program + week the target belongs to; used to refresh the results grid. */
  programId: string;
  weekNumber: number;
  /** The completion to review, or null when the dialog is closed. */
  target: CompletionFeedbackTarget | null;
  onOpenChange: (open: boolean) => void;
};
