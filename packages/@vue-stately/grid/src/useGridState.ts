import {type GridCollection, type GridNode, type Key} from './GridCollection';
import {ref, type Ref} from 'vue';

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
  collection: C,
  disabledKeys?: Iterable<Key>,
  focusMode?: 'cell' | 'row',
  selectedKeys?: Ref<Set<Key>>,
  selectionMode?: 'multiple' | 'none' | 'single'
}

function getChildNodes<T>(node: GridNode<T>): GridNode<T>[] {
  return node.childNodes ?? [];
}

/**
 * Provides state management for grid row selection and focused row/cell tracking.
 */
export function useGridState<T, C extends GridCollection<T>>(options: GridStateOptions<T, C>): GridState<T, C> {
  let selectionMode = options.selectionMode ?? 'none';
  let selectedKeys = options.selectedKeys ?? ref(new Set<Key>());
  let focusedKey = ref<Key | null>(null);
  let isFocused = ref(false);
  let disabledKeys = new Set(options.disabledKeys ?? []);

  let setSelectedKeys = (keys: Set<Key>): void => {
    if (selectionMode === 'none') {
      selectedKeys.value = new Set();
      return;
    }

    if (selectionMode === 'single') {
      let firstKey = keys.values().next().value;
      selectedKeys.value = firstKey == null ? new Set() : new Set([firstKey]);
      return;
    }

    selectedKeys.value = new Set(keys);
  };

  let setFocusedKey = (key: Key | null, child?: 'first' | 'last'): void => {
    if (options.focusMode === 'cell' && key != null) {
      let node = options.collection.getItem(key);
      if (node?.type === 'row') {
        let children = getChildNodes(node);
        if (children.length > 0) {
          focusedKey.value = child === 'last'
            ? children[children.length - 1].key
            : children[0].key;
          return;
        }
      }
    }

    focusedKey.value = key;
  };

  let selectionManager: SelectionManager = {
    selectedKeys,
    focusedKey,
    isFocused,
    setSelectedKeys,
    setFocusedKey,
    setFocused: (nextFocused) => {
      isFocused.value = nextFocused;
    },
    isDisabled: (key: Key) => disabledKeys.has(key),
    isSelected: (key: Key) => selectedKeys.value.has(key),
    toggleSelection: (key: Key) => {
      if (selectionMode === 'none' || disabledKeys.has(key)) {
        return;
      }

      if (selectionMode === 'single') {
        selectedKeys.value = selectedKeys.value.has(key) ? new Set() : new Set([key]);
        return;
      }

      let nextKeys = new Set(selectedKeys.value);
      if (nextKeys.has(key)) {
        nextKeys.delete(key);
      } else {
        nextKeys.add(key);
      }

      selectedKeys.value = nextKeys;
    }
  };

  return {
    collection: options.collection,
    disabledKeys,
    selectionManager,
    isKeyboardNavigationDisabled: ref(false)
  };
}
