import {computed, type ComputedRef, type Ref, ref, shallowRef, unref, watch} from 'vue';
import {
  type DisabledBehavior,
  type SelectionBehavior,
  SelectionManager,
  type SelectionMode,
  type SelectionValue,
  useMultipleSelectionState
} from '@vue-stately/selection';
import {useControlledState} from '@vue-stately/utils';
import {type Key, TreeCollection, type TreeNode} from './TreeCollection';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

export interface TreeProps<T> {
  allowDuplicateSelectionEvents?: boolean,
  collection?: MaybeRef<Iterable<TreeNode<T>> | TreeCollection<T> | null | undefined>,
  defaultExpandedKeys?: Iterable<Key>,
  defaultSelectedKeys?: SelectionValue | Iterable<Key> | null,
  disabledBehavior?: DisabledBehavior,
  disabledKeys?: Iterable<Key>,
  disallowEmptySelection?: boolean,
  expandedKeys?: Ref<Set<Key> | undefined>,
  items?: MaybeRef<Iterable<TreeNode<T>> | undefined>,
  onExpandedChange?: (keys: Set<Key>) => void,
  onSelectionChange?: (keys: SelectionValue) => void,
  selectedKeys?: Ref<SelectionValue | undefined>,
  selectionBehavior?: SelectionBehavior,
  selectionMode?: SelectionMode
}

export interface TreeState<T> {
  collection: TreeCollection<T>,
  disabledKeys: Set<Key>,
  expandedKeys: Set<Key>,
  selectionManager: SelectionManager,
  setExpandedKeys: (keys: Set<Key>) => void,
  toggleKey: (key: Key) => void
}

function toggleExpandedKey(keys: Set<Key>, key: Key): Set<Key> {
  let nextKeys = new Set(keys);
  if (nextKeys.has(key)) {
    nextKeys.delete(key);
  } else {
    nextKeys.add(key);
  }

  return nextKeys;
}

function resolveCollection<T>(props: TreeProps<T>, expandedKeys: Set<Key>): TreeCollection<T> {
  let providedCollection = props.collection ? unref(props.collection) : undefined;
  if (providedCollection instanceof TreeCollection) {
    return providedCollection;
  }

  let treeNodes = providedCollection ?? unref(props.items) ?? [];
  return new TreeCollection(treeNodes, {expandedKeys});
}

/**
 * Provides tree collection state, expansion state, and selection manager integration.
 */
export function useTreeState<T>(props: TreeProps<T>): TreeState<T> {
  let [expandedKeys, setExpandedKeysInternal] = useControlledState<Set<Key>>(
    props.expandedKeys,
    new Set<Key>(props.defaultExpandedKeys ?? []),
    props.onExpandedChange
  );

  let collection = shallowRef<TreeCollection<T>>(resolveCollection(props, expandedKeys.value));
  let selectionStateProps = {
    allowDuplicateSelectionEvents: props.allowDuplicateSelectionEvents,
    defaultSelectedKeys: props.defaultSelectedKeys,
    disabledBehavior: props.disabledBehavior,
    get disabledKeys() {
      return props.disabledKeys;
    },
    disallowEmptySelection: props.disallowEmptySelection,
    onSelectionChange: props.onSelectionChange,
    selectedKeys: props.selectedKeys,
    selectionBehavior: props.selectionBehavior,
    selectionMode: props.selectionMode ?? 'none'
  };
  let selectionState = useMultipleSelectionState(selectionStateProps);
  let selectionManager = new SelectionManager(collection.value, selectionState);
  let state: TreeState<T>;

  let syncCollection = (nextCollection: TreeCollection<T>): void => {
    collection.value = nextCollection;
    selectionManager.collection = nextCollection;
    if (state) {
      state.collection = nextCollection;
    }

    let focusedKey = selectionState.focusedKey.value;
    if (focusedKey != null && !nextCollection.getItem(focusedKey)) {
      selectionState.setFocusedKey(null);
    }
  };

  let setExpandedKeys = (keys: Set<Key>): void => {
    setExpandedKeysInternal(keys);
  };

  let toggleKey = (key: Key): void => {
    setExpandedKeys(toggleExpandedKey(expandedKeys.value, key));
  };

  state = {
    collection: collection.value,
    disabledKeys: selectionState.disabledKeys,
    expandedKeys: expandedKeys.value,
    selectionManager,
    setExpandedKeys,
    toggleKey
  };

  watch(expandedKeys, (nextExpandedKeys) => {
    if (state) {
      state.expandedKeys = nextExpandedKeys;
    }
    syncCollection(resolveCollection(props, nextExpandedKeys));
  }, {flush: 'sync'});

  watch(
    [
      () => props.collection ? unref(props.collection) : undefined,
      () => props.items ? unref(props.items) : undefined,
      () => props.disabledKeys
    ],
    () => {
      syncCollection(resolveCollection(props, expandedKeys.value));
      if (state) {
        state.disabledKeys = selectionState.disabledKeys;
      }
    },
    {flush: 'sync'}
  );

  return state;
}
