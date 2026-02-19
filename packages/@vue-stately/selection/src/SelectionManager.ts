import type {
  FocusStrategy,
  MultipleSelectionManager,
  MultipleSelectionState,
  SelectionBehavior,
  SelectionManagerCollection,
  SelectionManagerCollectionItem,
  SelectionMode,
  SelectionValue
} from './types';
import {type Key, Selection as SelectionSet} from './Selection';

function equalSets(a: Set<Key>, b: Set<Key>): boolean {
  if (a.size !== b.size) {
    return false;
  }

  for (let key of a) {
    if (!b.has(key)) {
      return false;
    }
  }

  return true;
}

function toSelectionSet(keys: Iterable<Key>): SelectionSet {
  return keys instanceof SelectionSet ? new SelectionSet(keys) : new SelectionSet(keys);
}

/**
 * Reads and updates multiple-selection state against a collection.
 */
export class SelectionManager implements MultipleSelectionManager {
  collection: SelectionManagerCollection;
  private state: MultipleSelectionState;
  private allowsCellSelection: boolean;

  constructor(
    collection: SelectionManagerCollection,
    state: MultipleSelectionState,
    options: {allowsCellSelection?: boolean} = {}
  ) {
    this.collection = collection;
    this.state = state;
    this.allowsCellSelection = Boolean(options.allowsCellSelection);
  }

  get selectionMode(): SelectionMode {
    return this.state.selectionMode;
  }

  get disallowEmptySelection(): boolean {
    return this.state.disallowEmptySelection;
  }

  get selectionBehavior(): SelectionBehavior {
    return this.state.selectionBehavior.value;
  }

  setSelectionBehavior(selectionBehavior: SelectionBehavior): void {
    this.state.setSelectionBehavior(selectionBehavior);
  }

  get isFocused(): boolean {
    return this.state.isFocused.value;
  }

  setFocused(isFocused: boolean): void {
    this.state.setFocused(isFocused);
  }

  get focusedKey(): Key | null {
    return this.state.focusedKey.value;
  }

  get childFocusStrategy(): FocusStrategy | null {
    return this.state.childFocusStrategy.value;
  }

  setFocusedKey(key: Key | null, childFocusStrategy?: FocusStrategy): void {
    if (key == null || this.collection.getItem(key)) {
      this.state.setFocusedKey(key, childFocusStrategy);
    }
  }

  get rawSelection(): SelectionValue {
    return this.state.selectedKeys.value;
  }

  get selectedKeys(): Set<Key> {
    if (this.rawSelection === 'all') {
      return new Set(this.getSelectAllKeys());
    }

    return new Set(this.rawSelection);
  }

  isSelected(key: Key): boolean {
    if (this.selectionMode === 'none') {
      return false;
    }

    if (this.rawSelection === 'all') {
      return this.canSelectItem(key);
    }

    return this.rawSelection.has(key);
  }

  get isEmpty(): boolean {
    return this.rawSelection !== 'all' && this.rawSelection.size === 0;
  }

  get isSelectAll(): boolean {
    let rawSelection = this.rawSelection;
    if (rawSelection === 'all') {
      return true;
    }

    let selectableKeys = this.getSelectAllKeys();
    if (selectableKeys.length === 0) {
      return false;
    }

    return selectableKeys.every((key) => rawSelection.has(key));
  }

  get firstSelectedKey(): Key | null {
    for (let key of this.collection.getKeys()) {
      if (this.isSelected(key)) {
        return key;
      }
    }

    return null;
  }

  get lastSelectedKey(): Key | null {
    let lastKey: Key | null = null;
    for (let key of this.collection.getKeys()) {
      if (this.isSelected(key)) {
        lastKey = key;
      }
    }

    return lastKey;
  }

  get disabledKeys(): Set<Key> {
    return this.state.disabledKeys;
  }

  get disabledBehavior(): 'all' | 'selection' {
    return this.state.disabledBehavior;
  }

  isSelectionEqual(selection: Set<Key>): boolean {
    return equalSets(this.selectedKeys, selection);
  }

  extendSelection(toKey: Key): void {
    if (this.selectionMode === 'none') {
      return;
    }

    if (this.selectionMode === 'single') {
      this.replaceSelection(toKey);
      return;
    }

    if (!this.canSelectItem(toKey)) {
      return;
    }

    let rawSelection = this.rawSelection;
    let selection = rawSelection === 'all'
      ? new SelectionSet([toKey], toKey, toKey)
      : toSelectionSet(rawSelection);
    let anchorKey = selection.anchorKey ?? selection.currentKey ?? this.firstSelectedKey ?? toKey;

    selection.anchorKey = anchorKey;
    selection.currentKey = toKey;
    selection.clear();

    for (let key of this.getKeyRange(anchorKey, toKey)) {
      if (this.canSelectItem(key)) {
        selection.add(key);
      }
    }

    this.state.setSelectedKeys(selection);
  }

  toggleSelection(key: Key): void {
    if (!this.canSelectItem(key)) {
      return;
    }

    if (this.selectionMode === 'single') {
      if (this.isSelected(key)) {
        if (this.disallowEmptySelection) {
          return;
        }

        this.clearSelection();
        return;
      }

      this.replaceSelection(key);
      return;
    }

    let selection = this.rawSelection === 'all'
      ? new SelectionSet(this.getSelectAllKeys())
      : toSelectionSet(this.rawSelection);

    if (selection.has(key)) {
      if (this.disallowEmptySelection && selection.size === 1) {
        return;
      }

      selection.delete(key);
    } else {
      selection.add(key);
    }

    this.state.setSelectedKeys(selection);
  }

  replaceSelection(key: Key): void {
    if (this.selectionMode === 'none' || !this.canSelectItem(key)) {
      return;
    }

    this.state.setSelectedKeys(new SelectionSet([key], key, key));
  }

  setSelectedKeys(keys: Iterable<Key>): void {
    if (this.selectionMode === 'none') {
      this.state.setSelectedKeys(new SelectionSet());
      return;
    }

    let selection = new SelectionSet(keys);
    if (this.selectionMode === 'single' && selection.size > 1) {
      let firstKey = selection.values().next().value;
      selection = firstKey == null ? new SelectionSet() : new SelectionSet([firstKey], firstKey, firstKey);
    }

    this.state.setSelectedKeys(selection);
  }

  selectAll(): void {
    if (this.selectionMode !== 'multiple') {
      return;
    }

    this.state.setSelectedKeys('all');
  }

  clearSelection(): void {
    if (this.disallowEmptySelection) {
      return;
    }

    this.state.setSelectedKeys(new SelectionSet());
  }

  toggleSelectAll(): void {
    if (this.selectionMode !== 'multiple') {
      return;
    }

    if (this.isSelectAll) {
      this.clearSelection();
      return;
    }

    this.selectAll();
  }

  select(key: Key, event?: {shiftKey?: boolean}): void {
    if (this.selectionMode === 'none') {
      return;
    }

    if (event?.shiftKey && this.selectionMode === 'multiple') {
      this.extendSelection(key);
      return;
    }

    if (this.selectionBehavior === 'replace') {
      this.replaceSelection(key);
      return;
    }

    this.toggleSelection(key);
  }

  canSelectItem(key: Key): boolean {
    if (this.selectionMode === 'none') {
      return false;
    }

    if (this.disabledKeys.has(key)) {
      return false;
    }

    let item = this.collection.getItem(key);
    if (!item) {
      return false;
    }

    if (item.type == null || item.type === 'item') {
      return true;
    }

    return this.allowsCellSelection && item.type === 'cell';
  }

  isDisabled(key: Key): boolean {
    return this.disabledBehavior === 'all' && this.disabledKeys.has(key);
  }

  isLink(key: Key): boolean {
    let item = this.collection.getItem(key);
    return typeof item?.props?.href === 'string';
  }

  getItemProps(key: Key): Record<string, unknown> {
    let item: SelectionManagerCollectionItem | null | undefined = this.collection.getItem(key);
    return item?.props ?? {};
  }

  private getSelectAllKeys(): Key[] {
    let keys: Key[] = [];
    for (let key of this.collection.getKeys()) {
      if (this.canSelectItem(key)) {
        keys.push(key);
      }
    }

    return keys;
  }

  private getKeyRange(fromKey: Key, toKey: Key): Key[] {
    let keys = Array.from(this.collection.getKeys());
    let fromIndex = keys.indexOf(fromKey);
    let toIndex = keys.indexOf(toKey);
    if (fromIndex === -1 || toIndex === -1) {
      return [toKey];
    }

    if (fromIndex <= toIndex) {
      return keys.slice(fromIndex, toIndex + 1);
    }

    return keys.slice(toIndex, fromIndex + 1);
  }
}
