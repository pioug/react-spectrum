import type {Key} from './Selection';
import {type Ref} from 'vue';

export type SelectionMode = 'multiple' | 'none' | 'single';
export type SelectionBehavior = 'replace' | 'toggle';
export type DisabledBehavior = 'all' | 'selection';
export type FocusStrategy = 'first' | 'last';
export type SelectionValue = 'all' | Set<Key>;

export interface FocusState {
  childFocusStrategy: Ref<FocusStrategy | null>,
  focusedKey: Ref<Key | null>,
  isFocused: Ref<boolean>,
  setFocused: (isFocused: boolean) => void,
  setFocusedKey: (key: Key | null, childFocusStrategy?: FocusStrategy) => void
}

export interface MultipleSelectionState extends FocusState {
  disallowEmptySelection: boolean,
  disabledBehavior: DisabledBehavior,
  disabledKeys: Set<Key>,
  selectedKeys: Ref<SelectionValue>,
  selectionBehavior: Ref<SelectionBehavior>,
  selectionMode: SelectionMode,
  setSelectedKeys: (keys: SelectionValue) => void,
  setSelectionBehavior: (selectionBehavior: SelectionBehavior) => void
}

export interface MultipleSelectionStateProps {
  allowDuplicateSelectionEvents?: boolean,
  defaultSelectedKeys?: SelectionValue | Iterable<Key> | null,
  disabledBehavior?: DisabledBehavior,
  disabledKeys?: Iterable<Key>,
  disallowEmptySelection?: boolean,
  onSelectionChange?: (keys: SelectionValue) => void,
  selectedKeys?: Ref<SelectionValue | undefined>,
  selectionBehavior?: SelectionBehavior,
  selectionMode?: SelectionMode
}

export interface SelectionManagerCollectionItem {
  key: Key,
  props?: Record<string, unknown>,
  type?: string
}

export interface SelectionManagerCollection {
  getItem: (key: Key) => SelectionManagerCollectionItem | null | undefined,
  getKeys: () => Iterable<Key>,
  getKeyAfter?: (key: Key) => Key | null,
  getKeyBefore?: (key: Key) => Key | null
}

export interface MultipleSelectionManager {
  collection: SelectionManagerCollection,
  childFocusStrategy: FocusStrategy | null,
  disallowEmptySelection: boolean,
  disabledBehavior: DisabledBehavior,
  disabledKeys: Set<Key>,
  firstSelectedKey: Key | null,
  focusedKey: Key | null,
  isEmpty: boolean,
  isFocused: boolean,
  isSelectAll: boolean,
  lastSelectedKey: Key | null,
  rawSelection: SelectionValue,
  selectedKeys: Set<Key>,
  selectionBehavior: SelectionBehavior,
  selectionMode: SelectionMode,
  canSelectItem: (key: Key) => boolean,
  clearSelection: () => void,
  extendSelection: (toKey: Key) => void,
  getItemProps: (key: Key) => Record<string, unknown>,
  isDisabled: (key: Key) => boolean,
  isLink: (key: Key) => boolean,
  isSelected: (key: Key) => boolean,
  isSelectionEqual: (selection: Set<Key>) => boolean,
  replaceSelection: (key: Key) => void,
  select: (key: Key, event?: {shiftKey?: boolean}) => void,
  selectAll: () => void,
  setFocused: (isFocused: boolean) => void,
  setFocusedKey: (key: Key | null, childFocusStrategy?: FocusStrategy) => void,
  setSelectedKeys: (keys: Iterable<Key>) => void,
  setSelectionBehavior: (selectionBehavior: SelectionBehavior) => void,
  toggleSelectAll: () => void,
  toggleSelection: (key: Key) => void
}
