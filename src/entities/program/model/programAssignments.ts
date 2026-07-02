import type { ProgramAssignment } from './versioning';

export type ProgramAssignmentsResult = {
  items: ProgramAssignment[];
  latestProgramVersionId: string | null;
};

export type SyncProgramAssignmentsParams = {
  allActive?: boolean;
  assignmentIds?: string[];
};

export type SyncProgramAssignmentsVariables = {
  programId: string;
  params: SyncProgramAssignmentsParams;
};

export type ProgramAssignmentSyncSkipped = {
  assignmentId: string;
  reason: string;
};

export type SyncProgramAssignmentsResponse = {
  synced: ProgramAssignment[];
  skipped: ProgramAssignmentSyncSkipped[];
};
