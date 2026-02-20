import type {Key, ListState} from '@vue-stately/list';

export type ListKey = Key;

export interface ListData {
  id?: string,
  isVirtualized?: boolean,
  linkBehavior?: 'action' | 'override' | 'selection',
  onAction?: (key: ListKey) => void,
  shouldFocusOnHover?: boolean,
  shouldSelectOnPressUp?: boolean,
  shouldUseVirtualFocus?: boolean
}

export const listData: WeakMap<ListState<unknown>, ListData> = new WeakMap<ListState<unknown>, ListData>();

function normalizeKey(key: ListKey): string {
  return String(key).replace(/\s*/g, '');
}

export function getItemId<T>(listBoxState: ListState<T>, itemKey: Key): string {
  let data = listData.get(listBoxState as unknown as ListState<unknown>);
  if (!data?.id) {
    throw new Error('Unknown listbox');
  }

  return `${data.id}-option-${normalizeKey(itemKey)}`;
}
