import type {ComputedRef, Ref} from 'vue';

export type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;
export type SelectionKey = string | number;

export interface SelectionItem {
  disabled?: boolean,
  key: SelectionKey,
  textValue: string
}

export interface KeyboardDelegate {
  getFirstKey: () => SelectionKey | null,
  getKeyAbove: (key: SelectionKey) => SelectionKey | null,
  getKeyBelow: (key: SelectionKey) => SelectionKey | null,
  getKeyForSearch?: (search: string, fromKey?: SelectionKey | null) => SelectionKey | null,
  getLastKey: () => SelectionKey | null
}

export interface SelectionManager {
  focusedKey: Ref<SelectionKey | null>,
  selectionMode: 'multiple' | 'none' | 'single',
  selectedKeys: Ref<Set<SelectionKey>>,
  setFocusedKey: (key: SelectionKey | null) => void,
  select: (key: SelectionKey) => void
}
