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
  assignLabel: string;
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
};
