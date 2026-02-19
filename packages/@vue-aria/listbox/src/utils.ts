export type ListKey = string | number;

export interface ListData {
  id?: string,
  isVirtualized?: boolean,
  linkBehavior?: 'action' | 'override' | 'selection',
  onAction?: (key: ListKey) => void,
  shouldFocusOnHover?: boolean,
  shouldSelectOnPressUp?: boolean,
  shouldUseVirtualFocus?: boolean
}

export const listData: WeakMap<object, ListData> = new WeakMap<object, ListData>();

function normalizeKey(key: ListKey): string {
  return String(key).replace(/\s*/g, '');
}

export function getItemId(listBoxState: object, itemKey: ListKey): string {
  let data = listData.get(listBoxState);
  if (!data?.id) {
    throw new Error('Unknown listbox');
  }

  return `${data.id}-option-${normalizeKey(itemKey)}`;
}
