export type { Client, ClientProgramSummary } from './model/types';
export { ClientStatus } from './model/types';
export type {
  ClientSortField,
  ClientSortOrder,
  ClientsListResult,
  ClientsPagination,
  FetchClientsListParams,
  FetchClientsParams,
  SetClientsProgramParams,
  SetClientsProgramResult,
  SkippedClientAssignment,
  TrainerInvite,
} from './api/clients.types';
export { useClientsInfinite, useCreateTrainerInvite, useSetClientsProgram } from './api/useClients';
export { getClientAvatarSrc, getClientInitials, isClientOwnedBy } from './lib';
export { ClientCard } from './ui/ClientCard/ClientCard';
export { ClientRowCard } from './ui/ClientRowCard/ClientRowCard';
export { ClientStatusBadge } from './ui/ClientStatusBadge/ClientStatusBadge';
export type { ClientCardLabels, ClientCardProps } from './ui/types';
