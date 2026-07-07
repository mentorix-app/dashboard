/**
 * A frozen snapshot of the program tree published for clients. New versions are
 * created by the publish-update flow; clients stay on their assigned version
 * until synced to the latest one.
 */
export type ProgramVersionSummary = {
  id: string;
  versionNumber: number;
  publishedAt: string;
  createdAt: string;
  assignmentCount: number;
  canDelete: boolean;
};

export enum ProgramAssignmentStatus {
  Active = 'active',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

/**
 * Links a client to a specific frozen program version. `isBehindLatest` is only
 * present in program-level assignment lists and drives the "sync" affordance.
 */
export type ProgramAssignment = {
  id: string;
  programId: string;
  programVersionId: string;
  trainerId: string;
  clientUserId: string;
  status: ProgramAssignmentStatus;
  assignedAt: string;
  createdAt: string;
  clientPlanAt: string | null;
  isBehindLatest?: boolean;
};
