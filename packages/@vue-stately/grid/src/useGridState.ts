import {type GridCollection, type GridNode, type Key} from './GridCollection';
import {computed, ref, type Ref, watchEffect} from 'vue';
import {useMultipleSelectionState} from '@vue-stately/selection';
import type {DisabledBehavior, MultipleSelectionState, SelectionBehavior} from '@vue-stately/selection';

export interface SelectionManager {
  focusedKey: Ref<Key | null>,
  isFocused: Ref<boolean>,
  selectedKeys: Ref<Set<Key>>,
  isDisabled: (key: Key) => boolean,
  isSelected: (key: Key) => boolean,
  setFocused: (isFocused: boolean) => void,
  setFocusedKey: (key: Key | null, child?: 'first' | 'last') => void,
  setSelectedKeys: (keys: Set<Key>) => void,
  toggleSelection: (key: Key) => void
}

export interface GridState<T, C extends GridCollection<T>> {
  collection: C,
  disabledKeys: Set<Key>,
  isKeyboardNavigationDisabled: Ref<boolean>,
  selectionManager: SelectionManager
}

export interface GridStateOptions<T, C extends GridCollection<T>> {
  allowDuplicateSelectionEvents?: boolean,
  collection: C,
  defaultSelectedKeys?: Iterable<Key>,
  disabledBehavior?: DisabledBehavior,
  disabledKeys?: Iterable<Key>,
  disallowEmptySelection?: boolean,
  focusMode?: 'cell' | 'row',
  onSelectionChange?: (keys: Set<Key>) => void,
  selectedKeys?: Ref<Set<Key>>,
  selectionBehavior?: SelectionBehavior,
  selectionMode?: 'multiple' | 'none' | 'single',
  UNSAFE_selectionState?: MultipleSelectionState
}

function getChildNodes<T>(node: GridNode<T>): GridNode<T>[] {
  return node.childNodes ?? [];
}

/**
 * Provides state management for grid row selection and focused row/cell tracking.
 */
export function useGridState<T, C extends GridCollection<T>>(options: GridStateOptions<T, C>): GridState<T, C> {
  let selectionState = options.UNSAFE_selectionState ?? useMultipleSelectionState({
    allowDuplicateSelectionEvents: options.allowDuplicateSelectionEvents,
    defaultSelectedKeys: options.defaultSelectedKeys,
    disabledBehavior: options.disabledBehavior,
    disabledKeys: options.disabledKeys,
    disallowEmptySelection: options.disallowEmptySelection,
    onSelectionChange: (keys) => {
      if (keys !== 'all') {
        options.onSelectionChange?.(new Set(keys));
      }
    },
    selectedKeys: options.selectedKeys as Ref<Set<Key> | 'all' | undefined> | undefined,
    selectionBehavior: options.selectionBehavior,
    selectionMode: options.selectionMode
  });

  let setFocusedKey = selectionState.setFocusedKey;
  selectionState.setFocusedKey = (key: Key | null, child: 'first' | 'last' = 'first') => {
    // If focusMode is cell and a row is focused, focus the first/last child cell instead.
    if (options.focusMode === 'cell' && key != null) {
      let node = options.collection.getItem(key);
      if (node?.type === 'row') {
        let children = getChildNodes(node);
        if (children.length > 0) {
          key = child === 'last'
            ? children[children.length - 1].key
            : children[0].key;
        }
      }
    }

    setFocusedKey(key, child);
  };

  let gridSelectionManager: SelectionManager = {
    selectedKeys: computed(() => {
      return selectionState.selectedKeys.value === 'all'
        ? new Set<Key>()
        : new Set(selectionState.selectedKeys.value);
    }) as Ref<Set<Key>>,
    focusedKey: selectionState.focusedKey,
    isFocused: selectionState.isFocused,
    setSelectedKeys: (keys: Set<Key>) => {
      selectionState.setSelectedKeys(new Set(keys));
    },
    setFocusedKey: (key: Key | null, child?: 'first' | 'last') => {
      selectionState.setFocusedKey(key, child);
    },
    setFocused: (nextFocused) => {
      selectionState.setFocused(nextFocused);
    },
    isDisabled: (key: Key) => selectionState.disabledKeys.has(key),
    isSelected: (key: Key) => {
      if (selectionState.selectedKeys.value === 'all') {
        return !selectionState.disabledKeys.has(key);
      }

      return selectionState.selectedKeys.value.has(key);
    },
    toggleSelection: (key: Key) => {
      if (selectionState.selectionMode === 'none' || selectionState.disabledKeys.has(key)) {
        return;
      }

      if (selectionState.selectionMode === 'single') {
        let selectedKeys = selectionState.selectedKeys.value === 'all'
          ? new Set<Key>()
          : new Set(selectionState.selectedKeys.value);
        if (selectedKeys.has(key)) {
          if (!selectionState.disallowEmptySelection) {
            selectionState.setSelectedKeys(new Set());
          }
          return;
        }

        selectionState.setSelectedKeys(new Set([key]));
        return;
      }

      let nextKeys = selectionState.selectedKeys.value === 'all'
        ? new Set<Key>()
        : new Set(selectionState.selectedKeys.value);
      if (nextKeys.has(key)) {
        nextKeys.delete(key);
      } else {
        nextKeys.add(key);
      }

      selectionState.setSelectedKeys(nextKeys);
    }
  };

  let cachedCollection = ref<C | null>(null);
  watchEffect(() => {
    let collection = options.collection;
    let focusedKey = selectionState.focusedKey.value;
    let previousCollection = cachedCollection.value;

    if (focusedKey != null && previousCollection && !collection.getItem(focusedKey)) {
      let previousNode = previousCollection.getItem(focusedKey);
      let previousParentNode = previousNode?.parentKey != null && previousNode.type === 'cell'
        ? previousCollection.getItem(previousNode.parentKey)
        : previousNode;

      if (!previousParentNode) {
        selectionState.setFocusedKey(null);
        cachedCollection.value = collection;
        return;
      }

      let previousRows = previousCollection.rows;
      let rows = collection.rows;
      let diff = previousRows.length - rows.length;
      let index = Math.min(
        diff > 1
          ? Math.max(previousParentNode.index - diff + 1, 0)
          : previousParentNode.index,
        rows.length - 1
      );

      let nextRow: GridNode<T> | null = null;
      while (index >= 0) {
        let row = rows[index];
        if (row && !gridSelectionManager.isDisabled(row.key)) {
          nextRow = row;
          break;
        }

        if (index < rows.length - 1) {
          index++;
        } else {
          if (index > previousParentNode.index) {
            index = previousParentNode.index;
          }
          index--;
        }
      }

      if (nextRow) {
        let childNodes = nextRow.hasChildNodes ? getChildNodes(nextRow) : [];
        let keyToFocus =
          nextRow.hasChildNodes
          && previousParentNode !== previousNode
          && previousNode
          && previousNode.index < childNodes.length
            ? childNodes[previousNode.index].key
            : nextRow.key;
        selectionState.setFocusedKey(keyToFocus);
      } else {
        selectionState.setFocusedKey(null);
      }
    }

    cachedCollection.value = collection;
  });

  return {
    get collection() {
      return options.collection;
    },
    get disabledKeys() {
      return selectionState.disabledKeys;
    },
    selectionManager: gridSelectionManager,
    isKeyboardNavigationDisabled: ref(false)
  };
}
