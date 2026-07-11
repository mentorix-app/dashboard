import type { Client, ClientCardLabels, ClientSortOrder, FetchClientsListParams } from '@/src/entities/client';
import type { ViewMode } from '@/src/features/ViewModeSwitch';

export type ClientCardItem = {
  client: Client;
  labels: ClientCardLabels;
  /** Whether the current user owns this client and may assign programs to it. */
  canAssign: boolean;
  /** Whether this client can be picked for bulk assignment (owned and active). */
  selectable: boolean;
};

export type ClientsSearchParamUpdateMode = 'push' | 'replace';

export type ClientsSearchParamUpdates = {
  name?: string;
  order?: ClientSortOrder;
  view?: ViewMode;
};

export type ClientsListState = {
  name?: string;
  sortOrder: ClientSortOrder;
  view: ViewMode;
};

export type ClientsSearchController = {
  search: string;
  listParams: FetchClientsListParams;
  view: ViewMode;
  sortOrder: ClientSortOrder;
  handleSearchChange: (value: string) => void;
  handleViewChange: (view: ViewMode) => void;
  handleSortOrderChange: (order: ClientSortOrder) => void;
};
