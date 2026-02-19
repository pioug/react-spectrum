import {computed, type ComputedRef, type Ref, shallowRef} from 'vue';
import {type Key, type Selection, type SelectionInput} from './types';

type Dispatch<T> = (updater: (state: T) => T) => void;

export interface ListOptions<T> {
  /** Initial items in the list. */
  initialItems?: T[],
  /** The keys for the initially selected items. */
  initialSelectedKeys?: SelectionInput,
  /** The initial text to filter the list by. */
  initialFilterText?: string,
  /** A function that returns a unique key for an item object. */
  getKey?: (item: T) => Key,
  /** A function that returns whether an item matches the current filter text. */
  filter?: (item: T, filterText: string) => boolean
}

export interface ListData<T> {
  /** The items in the list. */
  items: ComputedRef<T[]>,

  /** The keys of the currently selected items in the list. */
  selectedKeys: Readonly<Ref<Selection>>,

  /** Sets the selected keys. */
  setSelectedKeys(keys: SelectionInput): void,

  /** Adds the given keys to the current selected keys. */
  addKeysToSelection(keys: SelectionInput): void,

  /** Removes the given keys from the current selected keys. */
  removeKeysFromSelection(keys: SelectionInput): void,

  /** The current filter text. */
  filterText: Readonly<Ref<string>>,

  /** Sets the filter text. */
  setFilterText(filterText: string): void,

  /**
   * Gets an item from the list by key.
   * @param key - The key of the item to retrieve.
   */
  getItem(key: Key): T | undefined,

  /**
   * Inserts items into the list at the given index.
   * @param index - The index to insert into.
   * @param values - The values to insert.
   */
  insert(index: number, ...values: T[]): void,

  /**
   * Inserts items into the list before the item at the given key.
   * @param key - The key of the item to insert before.
   * @param values - The values to insert.
   */
  insertBefore(key: Key, ...values: T[]): void,

  /**
   * Inserts items into the list after the item at the given key.
   * @param key - The key of the item to insert after.
   * @param values - The values to insert.
   */
  insertAfter(key: Key, ...values: T[]): void,

  /**
   * Appends items to the list.
   * @param values - The values to insert.
   */
  append(...values: T[]): void,

  /**
   * Prepends items to the list.
   * @param values - The values to insert.
   */
  prepend(...values: T[]): void,

  /**
   * Removes items from the list by their keys.
   * @param keys - The keys of the items to remove.
   */
  remove(...keys: Key[]): void,

  /**
   * Removes all items from the list that are currently
   * in the set of selected items.
   */
  removeSelectedItems(): void,

  /**
   * Moves an item within the list.
   * @param key - The key of the item to move.
   * @param toIndex - The index to move the item to.
   */
  move(key: Key, toIndex: number): void,

  /**
   * Moves one or more items before a given key.
   * @param key - The key of the item to move the items before.
   * @param keys - The keys of the items to move.
   */
  moveBefore(key: Key, keys: Iterable<Key>): void,

  /**
   * Moves one or more items after a given key.
   * @param key - The key of the item to move the items after.
   * @param keys - The keys of the items to move.
   */
  moveAfter(key: Key, keys: Iterable<Key>): void,

  /**
   * Updates an item in the list.
   * @param key - The key of the item to update.
   * @param newValue - The new value for the item, or a function that returns the new value based on the previous value.
   */
  update(key: Key, newValue: T | ((prev: T) => T)): void
}

export interface ListState<T> {
  filterText: string,
  items: T[],
  selectedKeys: Selection
}

interface CreateListOptions<T, C> extends ListOptions<T> {
  cursor?: C
}

function normalizeSelection(selection: SelectionInput | undefined): Selection {
  if (selection === 'all') {
    return 'all';
  }

  return new Set(selection ?? []);
}

function selectionToSet(selection: SelectionInput | Selection): Set<Key> {
  if (selection === 'all') {
    return new Set();
  }

  return new Set(selection);
}

/**
 * Manages state for an immutable list data structure, and provides convenience methods to
 * update the data over time.
 */
export function useListData<T>(options: ListOptions<T>): ListData<T> {
  let {
    initialItems = [],
    initialSelectedKeys,
    getKey = (item: any) => item.id ?? item.key,
    filter,
    initialFilterText = ''
  } = options;

  let state = shallowRef<ListState<T>>({
    items: initialItems,
    selectedKeys: normalizeSelection(initialSelectedKeys),
    filterText: initialFilterText
  });

  let dispatch: Dispatch<ListState<T>> = (updater) => {
    state.value = updater(state.value);
  };

  let filteredItems = computed(() => {
    if (!filter) {
      return state.value.items;
    }

    return state.value.items.filter((item) => filter(item, state.value.filterText));
  });

  return {
    items: filteredItems,
    selectedKeys: computed(() => state.value.selectedKeys),
    filterText: computed(() => state.value.filterText),
    ...createListActions({getKey}, dispatch),
    getItem(key: Key) {
      return state.value.items.find((item) => getKey(item) === key);
    }
  };
}

export function createListActions<T, C>(
  opts: CreateListOptions<T, C>,
  dispatch: Dispatch<ListState<T>>
): Omit<ListData<T>, 'filterText' | 'getItem' | 'items' | 'selectedKeys'> {
  let {cursor, getKey} = opts;

  return {
    setSelectedKeys(selectedKeys: SelectionInput) {
      dispatch((state) => ({
        ...state,
        selectedKeys: normalizeSelection(selectedKeys)
      }));
    },
    addKeysToSelection(selectedKeys: SelectionInput) {
      dispatch((state) => {
        if (state.selectedKeys === 'all') {
          return state;
        }

        if (selectedKeys === 'all') {
          return {
            ...state,
            selectedKeys: 'all'
          };
        }

        return {
          ...state,
          selectedKeys: new Set([...state.selectedKeys, ...selectedKeys])
        };
      });
    },
    removeKeysFromSelection(selectedKeys: SelectionInput) {
      dispatch((state) => {
        if (selectedKeys === 'all') {
          return {
            ...state,
            selectedKeys: new Set()
          };
        }

        let selection: Selection = state.selectedKeys === 'all'
          ? new Set(state.items.map(getKey!))
          : new Set(state.selectedKeys);

        for (let key of selectedKeys) {
          selection.delete(key);
        }

        return {
          ...state,
          selectedKeys: selection
        };
      });
    },
    setFilterText(filterText: string) {
      dispatch((state) => ({
        ...state,
        filterText
      }));
    },
    insert(index: number, ...values: T[]) {
      dispatch((state) => insert(state, index, ...values));
    },
    insertBefore(key: Key, ...values: T[]) {
      dispatch((state) => {
        let index = state.items.findIndex((item) => getKey?.(item) === key);

        if (index === -1) {
          if (state.items.length === 0) {
            index = 0;
          } else {
            return state;
          }
        }

        return insert(state, index, ...values);
      });
    },
    insertAfter(key: Key, ...values: T[]) {
      dispatch((state) => {
        let index = state.items.findIndex((item) => getKey?.(item) === key);

        if (index === -1) {
          if (state.items.length === 0) {
            index = 0;
          } else {
            return state;
          }
        }

        return insert(state, index + 1, ...values);
      });
    },
    prepend(...values: T[]) {
      dispatch((state) => insert(state, 0, ...values));
    },
    append(...values: T[]) {
      dispatch((state) => insert(state, state.items.length, ...values));
    },
    remove(...keys: Key[]) {
      dispatch((state) => {
        let keySet = new Set(keys);
        let items = state.items.filter((item) => !keySet.has(getKey!(item)));

        let selection: Selection = 'all';
        if (state.selectedKeys !== 'all') {
          selection = new Set(state.selectedKeys);
          for (let key of keys) {
            selection.delete(key);
          }
        }

        if (cursor == null && items.length === 0) {
          selection = new Set();
        }

        return {
          ...state,
          items,
          selectedKeys: selection
        };
      });
    },
    removeSelectedItems() {
      dispatch((state) => {
        if (state.selectedKeys === 'all') {
          return {
            ...state,
            items: [],
            selectedKeys: new Set()
          };
        }

        let selectedKeys = state.selectedKeys;
        let items = state.items.filter((item) => !selectedKeys.has(getKey!(item)));

        return {
          ...state,
          items,
          selectedKeys: new Set()
        };
      });
    },
    move(key: Key, toIndex: number) {
      dispatch((state) => {
        let index = state.items.findIndex((item) => getKey!(item) === key);
        if (index === -1) {
          return state;
        }

        let copy = state.items.slice();
        let [item] = copy.splice(index, 1);
        copy.splice(toIndex, 0, item);

        return {
          ...state,
          items: copy
        };
      });
    },
    moveBefore(key: Key, keys: Iterable<Key>) {
      dispatch((state) => {
        let toIndex = state.items.findIndex((item) => getKey!(item) === key);
        if (toIndex === -1) {
          return state;
        }

        let keyArray = Array.isArray(keys) ? keys : [...keys];
        let indices = keyArray
          .map((nextKey) => state.items.findIndex((item) => getKey!(item) === nextKey))
          .filter((index) => index >= 0)
          .sort((a, b) => a - b);

        if (indices.length === 0) {
          return state;
        }

        return move(state, indices, toIndex);
      });
    },
    moveAfter(key: Key, keys: Iterable<Key>) {
      dispatch((state) => {
        let toIndex = state.items.findIndex((item) => getKey!(item) === key);
        if (toIndex === -1) {
          return state;
        }

        let keyArray = Array.isArray(keys) ? keys : [...keys];
        let indices = keyArray
          .map((nextKey) => state.items.findIndex((item) => getKey!(item) === nextKey))
          .filter((index) => index >= 0)
          .sort((a, b) => a - b);

        if (indices.length === 0) {
          return state;
        }

        return move(state, indices, toIndex + 1);
      });
    },
    update(key: Key, newValue: T | ((prev: T) => T)) {
      dispatch((state) => {
        let index = state.items.findIndex((item) => getKey!(item) === key);
        if (index === -1) {
          return state;
        }

        let updatedValue: T;
        if (typeof newValue === 'function') {
          updatedValue = (newValue as (prev: T) => T)(state.items[index]);
        } else {
          updatedValue = newValue;
        }

        return {
          ...state,
          items: [
            ...state.items.slice(0, index),
            updatedValue,
            ...state.items.slice(index + 1)
          ]
        };
      });
    }
  };
}

function insert<T>(state: ListState<T>, index: number, ...values: T[]): ListState<T> {
  return {
    ...state,
    items: [
      ...state.items.slice(0, index),
      ...values,
      ...state.items.slice(index)
    ]
  };
}

function move<T>(state: ListState<T>, indices: number[], toIndex: number): ListState<T> {
  toIndex -= indices.filter((index) => index < toIndex).length;

  let moves = indices.map((from) => ({
    from,
    to: toIndex++
  }));

  for (let i = 0; i < moves.length; i++) {
    let a = moves[i].from;
    for (let j = i; j < moves.length; j++) {
      let b = moves[j].from;
      if (b > a) {
        moves[j].from--;
      }
    }
  }

  for (let i = 0; i < moves.length; i++) {
    let a = moves[i];
    for (let j = moves.length - 1; j > i; j--) {
      let b = moves[j];
      if (b.from < a.to) {
        a.to++;
      } else {
        b.from++;
      }
    }
  }

  let copy = state.items.slice();
  for (let nextMove of moves) {
    let [item] = copy.splice(nextMove.from, 1);
    copy.splice(nextMove.to, 0, item);
  }

  return {
    ...state,
    items: copy
  };
}

export {normalizeSelection, selectionToSet};
