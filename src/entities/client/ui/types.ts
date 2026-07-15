import type { Client } from '../model/types';

/** Localized, pre-formatted strings the widget passes down to the dumb cards. */
export type ClientCardLabels = {
  statusLabel: string;
  linkedLabel: string;
  /** Localized program name, or empty string when no program is assigned. */
  programName: string;
  /** Link to the assigned program's page, or undefined when none is assigned. */
  programHref?: string;
  programLabel: string;
  /** Trainer name line, shown only when an admin views another trainer's client. */
  trainerLabel?: string;
  /** Last-activity line, or the "no activity" fallback when never active. */
  lastActiveLabel: string;
  assignLabel: string;
  /** Tooltip/aria label for the per-client sync-to-latest button. */
  syncLabel: string;
  avatarAlt: string;
  blockedHint?: string;
  selectLabel: string;
};

export type ClientCardProps = {
  client: Client;
  labels: ClientCardLabels;
  onAssign: (clientUserId: string) => void;
  /** Whether the current user owns this client and can assign programs to it. */
  canAssign: boolean;
  /** Whether this client can be picked for bulk assignment (owned and active). */
  selectable: boolean;
  isSelected: boolean;
  onToggleSelect: (clientUserId: string) => void;
  /** Whether the assigned program is behind latest and can be synced. */
  canSync: boolean;
  /** Whether a sync request for this client is in flight. */
  isSyncing: boolean;
  onSync: (clientUserId: string) => void;
};
