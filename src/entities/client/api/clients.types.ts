import type { Client } from '../model/types';

export type ClientSortField = 'name' | 'linkedAt';

export type ClientSortOrder = 'asc' | 'desc';

export type FetchClientsParams = {
  name?: string;
  sortBy?: ClientSortField;
  sortOrder?: ClientSortOrder;
};

export type FetchClientsListParams = FetchClientsParams;

export type ClientsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ClientsListResult = {
  items: Client[];
  pagination: ClientsPagination;
};

/** One-time Telegram invite the trainer shares to onboard a new client. */
export type TrainerInvite = {
  id: string;
  inviteUrl: string;
  expiresAt: string;
  createdAt: string;
};

export type SetClientsProgramParams = {
  /** Published program to assign; null clears the active assignment. */
  programId: string | null;
  /** 1–100 linked client ids. Pass a single id to assign one client. */
  clientUserIds: string[];
};

/** A client the bulk assignment could not process (not linked, blocked, or not found). */
export type SkippedClientAssignment = {
  clientUserId: string;
  reason: string;
};

/** Result of a bulk program assignment across one or more clients. */
export type SetClientsProgramResult = {
  /** Clients whose program was set (present when a program id was provided). */
  assigned: unknown[];
  /** Client ids whose active assignment was removed (present when clearing). */
  cleared: string[];
  /** Per-client failures; the rest of the request still succeeds. */
  skipped: SkippedClientAssignment[];
};
