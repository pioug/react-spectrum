import {computed, type ComputedRef, type Ref, ref, shallowRef, unref, watch} from 'vue';
import {
  type DisabledBehavior,
  type SelectionBehavior,
  SelectionManager,
  type SelectionMode,
  type SelectionValue,
  useMultipleSelectionState
} from '@vue-stately/selection';
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
  let uncontrolledExpandedKeys = ref(new Set<Key>(props.defaultExpandedKeys ?? []));
  let isExpandedKeysControlled = computed(() => props.expandedKeys !== undefined && props.expandedKeys.value !== undefined);
  let wasExpandedKeysControlled = ref(isExpandedKeysControlled.value);

  watch(isExpandedKeysControlled, (nextIsControlled) => {
    if (wasExpandedKeysControlled.value !== nextIsControlled && process.env.NODE_ENV !== 'production') {
      console.warn(`WARN: A component changed from ${wasExpandedKeysControlled.value ? 'controlled' : 'uncontrolled'} to ${nextIsControlled ? 'controlled' : 'uncontrolled'}.`);
    }
    wasExpandedKeysControlled.value = nextIsControlled;
  });

  let expandedKeys = computed<Set<Key>>({
    get: () => {
      if (isExpandedKeysControlled.value && props.expandedKeys) {
        return props.expandedKeys.value;
      }

      return uncontrolledExpandedKeys.value;
    },
    set: (nextKeys) => {
      if (isExpandedKeysControlled.value && props.expandedKeys) {
        props.expandedKeys.value = nextKeys;
      } else {
        uncontrolledExpandedKeys.value = nextKeys;
      }
    }
  });

  let disabledKeys = props.disabledKeys ? new Set(props.disabledKeys) : new Set<Key>();
  let collection = shallowRef<TreeCollection<T>>(resolveCollection(props, expandedKeys.value));
  let selectionState = useMultipleSelectionState({
    allowDuplicateSelectionEvents: props.allowDuplicateSelectionEvents,
    defaultSelectedKeys: props.defaultSelectedKeys,
    disabledBehavior: props.disabledBehavior,
    disabledKeys,
    disallowEmptySelection: props.disallowEmptySelection,
    onSelectionChange: props.onSelectionChange,
    selectedKeys: props.selectedKeys,
    selectionBehavior: props.selectionBehavior,
    selectionMode: props.selectionMode ?? 'none'
  });
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
    let nextKeys = new Set(keys);
    if (equalSets(nextKeys, expandedKeys.value)) {
      return;
    }

    expandedKeys.value = nextKeys;
    if (state) {
      state.expandedKeys = nextKeys;
    }
    props.onExpandedChange?.(new Set(nextKeys));
    syncCollection(resolveCollection(props, nextKeys));
  };

  let toggleKey = (key: Key): void => {
    setExpandedKeys(toggleExpandedKey(expandedKeys.value, key));
  };

  state = {
    collection: collection.value,
    disabledKeys,
    expandedKeys: expandedKeys.value,
    selectionManager,
    setExpandedKeys,
    toggleKey
  };

  return state;
}
