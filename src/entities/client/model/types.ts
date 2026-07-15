export enum ClientStatus {
  Active = 'active',
  Blocked = 'blocked',
}

/** Active program assignment summary attached to a trainer's client. */
export type ClientProgramSummary = {
  programId: string;
  programVersionId: string;
  /** Active assignment id; used to sync this client to the latest version. */
  assignmentId: string;
  assignedAt: string;
  /** Frozen version display name (English). */
  programName: string;
  /** Frozen version display name (Russian). */
  programNameRu: string;
  /** True when the client's frozen version is behind the program's latest. */
  isBehindLatest?: boolean;
};

/** A client linked to the current trainer via an accepted Telegram invite. */
export type Client = {
  clientUserId: string;
  /**
   * User id of the trainer for this client link. For admins (who see every
   * trainer's clients) this identifies which clients they may assign programs
   * to — compare against the current user id from `/auth/me`.
   */
  trainerUserId: string;
  /** Display name of the trainer for this client link (used by admin views). */
  trainerDisplayName: string;
  displayName: string;
  status: ClientStatus;
  linkedAt: string;
  /**
   * Latest workout-day completion timestamp for this client (any trainer), or
   * null when the client has never completed a workout day.
   */
  lastActiveAt: string | null;
  /**
   * Signed relative URL to the avatar proxy
   * (`/trainer/clients/{id}/avatar?exp=&sig=`), or empty string when the client
   * has no Telegram profile photo. Use `getClientAvatarSrc` to resolve it.
   */
  avatarUrl: string;
  programAssignment: ClientProgramSummary | null;
};
