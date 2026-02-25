import type {ComputedRef, Ref} from 'vue';

export type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;
export type SelectionKey = string | number;
export type SelectionMode = 'multiple' | 'none' | 'single';
export type SelectionValue<T> = T | Ref<T> | ComputedRef<T>;

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
  focusedKey: SelectionValue<SelectionKey | null>,
  selectionMode: SelectionValue<SelectionMode>,
  selectedKeys: SelectionValue<Set<SelectionKey>>,
  setFocusedKey: (key: SelectionKey | null, ...args: unknown[]) => void,
  select: (key: SelectionKey, event?: {shiftKey?: boolean}) => void
}
