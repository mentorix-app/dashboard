import type { ClientSortOrder } from '@/src/entities/client';
import type { ViewMode } from '@/src/features/ViewModeSwitch';

import type { ClientsListState, ClientsSearchParamUpdates } from './Clients.types';

type SearchParamsReader = {
  get: (name: string) => string | null;
};

const SORT_ORDERS: readonly ClientSortOrder[] = ['asc', 'desc'];
const VIEW_MODES: readonly ViewMode[] = ['grid', 'list'];

const getValidValue = <T extends string>(values: readonly T[], selected: string | null, fallback: T): T =>
  values.find((value) => value === selected) ?? fallback;

export const parseClientsSearchParams = (searchParams: SearchParamsReader): ClientsListState => ({
  name: searchParams.get('q')?.trim() || undefined,
  sortOrder: getValidValue(SORT_ORDERS, searchParams.get('order'), 'asc'),
  view: getValidValue(VIEW_MODES, searchParams.get('view'), 'grid'),
});

export const createClientsSearchParams = (
  currentSearchParams: string,
  updates: ClientsSearchParamUpdates
): URLSearchParams => {
  const params = new URLSearchParams(currentSearchParams);

  if ('name' in updates) {
    const name = updates.name?.trim();
    if (name) params.set('q', name);
    else params.delete('q');
  }
  if ('order' in updates && updates.order) params.set('order', updates.order);
  if ('view' in updates && updates.view) params.set('view', updates.view);

  return params;
};
