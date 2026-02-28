import {computed, type ComputedRef, type Ref, ref, unref, watch} from 'vue';
import {type Key, ListCollection, type ListNode} from './ListCollection';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

export type SelectionMode = 'multiple' | 'none' | 'single';

export interface ListProps<T> {
  allowDuplicateSelectionEvents?: boolean,
  collection?: MaybeRef<Iterable<ListNode<T>> | ListCollection<T> | null | undefined>,
  defaultSelectedKeys?: Iterable<Key>,
  disabledKeys?: Iterable<Key>,
  disallowEmptySelection?: boolean,
  filter?: (nodes: Iterable<ListNode<T>>) => Iterable<ListNode<T>>,
  items?: MaybeRef<Iterable<ListNode<T>> | undefined>,
  layoutDelegate?: unknown,
  onSelectionChange?: (keys: Set<Key>) => void,
  selectedKeys?: Ref<Set<Key>>,
  selectionMode?: SelectionMode,
  suppressTextValueWarning?: boolean
}

export interface SelectionManager<T> {
  collection: ListCollection<T>,
  disabledKeys: Set<Key>,
  focusedKey: Ref<Key | null>,
  isFocused: Ref<boolean>,
  selectedKeys: Ref<Set<Key>>,
  selectionMode: SelectionMode,
  clearSelection: () => void,
  isDisabled: (key: Key) => boolean,
  isSelected: (key: Key) => boolean,
  replaceSelection: (key: Key) => void,
  select: (key: Key) => void,
  selectAll: () => void,
  setFocused: (isFocused: boolean) => void,
  setFocusedKey: (key: Key | null) => void,
  setSelectedKeys: (keys: Iterable<Key>) => void,
  toggleSelectAll: () => void,
  toggleSelection: (key: Key) => void,
  withCollection: (collection: ListCollection<T>) => SelectionManager<T>,
  readonly firstSelectedKey: Key | null,
  readonly isEmpty: boolean,
  readonly lastSelectedKey: Key | null
}

export interface ListState<T> {
  collection: ListCollection<T>,
  disabledKeys: Set<Key>,
  selectionManager: SelectionManager<T>
}

interface SelectionContext<T> {
  allowDuplicateSelectionEvents: boolean,
  collection: ListCollection<T>,
  disabledKeys: Set<Key>,
  disallowEmptySelection: boolean,
  focusedKey: Ref<Key | null>,
  isFocused: Ref<boolean>,
  onSelectionChange?: (keys: Set<Key>) => void,
  selectedKeys: Ref<Set<Key>>,
  selectionMode: SelectionMode
}

function resolveCollection<T>(props: ListProps<T>): ListCollection<T> {
  let providedCollection = props.collection ? unref(props.collection) : undefined;
  if (providedCollection instanceof ListCollection) {
    return providedCollection;
  }

  let nodes = providedCollection
    ?? unref(props.items)
    ?? [];
  let filteredNodes = props.filter ? props.filter(nodes) : nodes;
  return new ListCollection(filteredNodes);
}

function getSelectableKeys<T>(collection: ListCollection<T>, disabledKeys: Set<Key>): Key[] {
  let keys: Key[] = [];

  for (let key of collection.getKeys()) {
    if (disabledKeys.has(key)) {
      continue;
    }

    let item = collection.getItem(key);
    if (item?.type === 'item') {
      keys.push(key);
    }
  }

  return keys;
}

function normalizeSelection<T>(keys: Iterable<Key>, context: SelectionContext<T>): Set<Key> {
  if (context.selectionMode === 'none') {
    return new Set();
  }

  let nextKeys = new Set<Key>();

  for (let key of keys) {
    if (context.disabledKeys.has(key)) {
      continue;
    }

    if (!context.collection.getItem(key)) {
      continue;
    }

    let node = context.collection.getItem(key);
    if (node?.type !== 'item') {
      continue;
    }

    nextKeys.add(key);
  }

  if (context.selectionMode === 'single' && nextKeys.size > 1) {
    let firstKey = nextKeys.values().next().value;
    nextKeys = firstKey == null ? new Set() : new Set([firstKey]);
  }

  if (context.disallowEmptySelection && nextKeys.size === 0) {
    let firstSelectableKey = getSelectableKeys(context.collection, context.disabledKeys)[0] ?? null;
    if (firstSelectableKey != null) {
      nextKeys.add(firstSelectableKey);
    }
  }

  return nextKeys;
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

function toArray<T>(iterable: Iterable<T>): T[] {
  return Array.from(iterable);
}

function findClosestFocusableKey<T>(
  collection: ListCollection<T>,
  disabledKeys: Set<Key>,
  preferredIndex: number | null
): Key | null {
  let itemKeys = toArray(collection.getKeys())
    .map((key) => collection.getItem(key))
    .filter((node): node is ListNode<T> => node != null && node.type === 'item')
    .map((node) => node.key)
    .filter((key) => !disabledKeys.has(key));

  if (itemKeys.length === 0) {
    return null;
  }

  if (preferredIndex == null) {
    return itemKeys[0];
  }

  let index = Math.min(Math.max(preferredIndex, 0), itemKeys.length - 1);
  return itemKeys[index] ?? itemKeys[0] ?? null;
}

function resetFocusedKeyIfMissing<T>(
  collection: ListCollection<T>,
  selectionManager: SelectionManager<T>,
  previousCollection: ListCollection<T> | null
): void {
  let focusedKey = selectionManager.focusedKey.value;
  if (focusedKey == null || collection.getItem(focusedKey)) {
    return;
  }

  let previousIndex = previousCollection?.getItem(focusedKey)?.index ?? null;
  let nextFocusedKey = findClosestFocusableKey(collection, selectionManager.disabledKeys, previousIndex);
  selectionManager.setFocusedKey(nextFocusedKey);
}

function getEdgeSelectedKey<T>(
  collection: ListCollection<T>,
  selectedKeys: Set<Key>,
  edge: 'first' | 'last'
): Key | null {
  let orderedKeys = toArray(collection.getKeys());
  if (edge === 'last') {
    orderedKeys.reverse();
  }

  for (let key of orderedKeys) {
    if (selectedKeys.has(key)) {
      return key;
    }
  }

  return null;
}

function createSelectionManager<T>(context: SelectionContext<T>): SelectionManager<T> {
  let commitSelection = (keys: Iterable<Key>, forceNotify = false): void => {
    let normalizedKeys = normalizeSelection(keys, context);
    let changed = !equalSets(normalizedKeys, context.selectedKeys.value);

    if (changed) {
      context.selectedKeys.value = normalizedKeys;
    }

    if (changed || forceNotify || context.allowDuplicateSelectionEvents) {
      context.onSelectionChange?.(new Set(normalizedKeys));
    }
  };

  let manager: SelectionManager<T> = {
    collection: context.collection,
    disabledKeys: context.disabledKeys,
    selectionMode: context.selectionMode,
    focusedKey: context.focusedKey,
    isFocused: context.isFocused,
    selectedKeys: context.selectedKeys,
    isDisabled: (key: Key) => {
      return context.disabledKeys.has(key);
    },
    isSelected: (key: Key) => {
      if (!context.collection.getItem(key)) {
        return false;
      }

      return context.selectedKeys.value.has(key);
    },
    clearSelection: () => {
      commitSelection(new Set());
    },
    setSelectedKeys: (keys: Iterable<Key>) => {
      commitSelection(keys);
    },
    replaceSelection: (key: Key) => {
      commitSelection([key]);
    },
    toggleSelection: (key: Key) => {
      if (context.selectionMode === 'none' || context.disabledKeys.has(key)) {
        return;
      }

      if (context.selectionMode === 'single') {
        if (context.selectedKeys.value.has(key)) {
          if (!context.disallowEmptySelection) {
            commitSelection([]);
          } else {
            commitSelection([key], true);
          }
          return;
        }

        commitSelection([key]);
        return;
      }

      let nextKeys = new Set(context.selectedKeys.value);
      if (nextKeys.has(key)) {
        nextKeys.delete(key);
      } else {
        nextKeys.add(key);
      }

      commitSelection(nextKeys);
    },
    selectAll: () => {
      if (context.selectionMode === 'none') {
        return;
      }

      let selectableKeys = getSelectableKeys(context.collection, context.disabledKeys);
      if (context.selectionMode === 'single') {
        let firstSelectableKey = selectableKeys[0] ?? null;
        if (firstSelectableKey != null) {
          commitSelection([firstSelectableKey]);
        }
        return;
      }

      commitSelection(selectableKeys);
    },
    toggleSelectAll: () => {
      if (context.selectionMode !== 'multiple') {
        return;
      }

      let selectableKeys = getSelectableKeys(context.collection, context.disabledKeys);
      let currentlySelected = new Set(context.selectedKeys.value);
      let isAllSelected = selectableKeys.length > 0 && selectableKeys.every((key) => currentlySelected.has(key));
      if (isAllSelected) {
        commitSelection([]);
        return;
      }

      commitSelection(selectableKeys);
    },
    select: (key: Key) => {
      if (context.selectionMode === 'multiple') {
        manager.toggleSelection(key);
        return;
      }

      manager.replaceSelection(key);
    },
    setFocused: (isFocused: boolean) => {
      manager.isFocused.value = isFocused;
    },
    setFocusedKey: (key: Key | null) => {
      if (key == null || context.collection.getItem(key)) {
        manager.focusedKey.value = key;
      }
    },
    withCollection: (collection: ListCollection<T>) => {
      return createSelectionManager({
        ...context,
        collection
      });
    },
    get firstSelectedKey() {
      return getEdgeSelectedKey(context.collection, context.selectedKeys.value, 'first');
    },
    get lastSelectedKey() {
      return getEdgeSelectedKey(context.collection, context.selectedKeys.value, 'last');
    },
    get isEmpty() {
      return context.selectedKeys.value.size === 0;
    }
  };

  return manager;
}

/**
 * Provides state management for list collections with selection state.
 */
export function useListState<T extends object>(props: ListProps<T>): ListState<T> {
  let collection = ref(resolveCollection(props));
  let selectionMode = computed(() => props.selectionMode ?? 'none');
  let disabledKeys = computed(() => {
    return props.disabledKeys ? new Set(props.disabledKeys) : new Set<Key>();
  });
  let selectedKeys = props.selectedKeys ?? ref(new Set(props.defaultSelectedKeys ?? []));
  let focusedKey = ref<Key | null>(null);
  let isFocused = ref(false);

  let context: SelectionContext<T> = {
    allowDuplicateSelectionEvents: Boolean(props.allowDuplicateSelectionEvents),
    collection: collection.value,
    disabledKeys: disabledKeys.value,
    disallowEmptySelection: Boolean(props.disallowEmptySelection),
    focusedKey,
    isFocused,
    onSelectionChange: props.onSelectionChange,
    selectedKeys,
    selectionMode: selectionMode.value
  };

  selectedKeys.value = normalizeSelection(selectedKeys.value, context);

  let selectionManager = createSelectionManager(context);
  resetFocusedKeyIfMissing(collection.value, selectionManager, null);

  let state: ListState<T> = {
    get collection() {
      return collection.value;
    },
    get disabledKeys() {
      return context.disabledKeys;
    },
    selectionManager
  };

  watch(disabledKeys, (nextDisabledKeys) => {
    context.disabledKeys = nextDisabledKeys;
    selectionManager.disabledKeys = nextDisabledKeys;
    selectionManager.setSelectedKeys(new Set(selectedKeys.value));
  }, {flush: 'sync'});

  watch(
    [
      () => props.collection ? unref(props.collection) : undefined,
      () => props.items ? unref(props.items) : undefined,
      () => props.filter
    ],
    () => {
      let previousCollection = context.collection;
      let nextCollection = resolveCollection(props);
      context.collection = nextCollection;
      collection.value = nextCollection;
      selectionManager.collection = nextCollection;
      selectionManager.setSelectedKeys(new Set(selectedKeys.value));
      resetFocusedKeyIfMissing(nextCollection, selectionManager, previousCollection);
    },
    {flush: 'sync'}
  );

  watch(selectionMode, (nextSelectionMode) => {
    context.selectionMode = nextSelectionMode;
    selectionManager.selectionMode = nextSelectionMode;
    selectionManager.setSelectedKeys(new Set(selectedKeys.value));
  }, {flush: 'sync'});

  watch(() => props.disallowEmptySelection, (nextDisallowEmptySelection) => {
    context.disallowEmptySelection = Boolean(nextDisallowEmptySelection);
    selectionManager.setSelectedKeys(new Set(selectedKeys.value));
  }, {flush: 'sync'});

  watch(() => props.allowDuplicateSelectionEvents, (nextAllowDuplicateSelectionEvents) => {
    context.allowDuplicateSelectionEvents = Boolean(nextAllowDuplicateSelectionEvents);
  }, {flush: 'sync'});

  watch(() => props.onSelectionChange, (nextOnSelectionChange) => {
    context.onSelectionChange = nextOnSelectionChange;
  }, {flush: 'sync'});

  return state;
}

/**
 * Filters an existing list state and returns a selection manager bound to the filtered collection.
 */
export function UNSTABLE_useFilteredListState<T extends object>(
  state: ListState<T>,
  filterFn: ((nodeValue: string, node: ListNode<T>) => boolean) | null | undefined
): ListState<T> {
  let collection = filterFn ? state.collection.filter(filterFn) : state.collection;
  let selectionManager = state.selectionManager.withCollection(collection);
  resetFocusedKeyIfMissing(collection, selectionManager, state.collection);

  return {
    collection,
    selectionManager,
    disabledKeys: state.disabledKeys
  };
}
