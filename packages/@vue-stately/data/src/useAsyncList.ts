import {computed, type Ref, shallowRef} from 'vue';
import {createListActions, type ListState} from './useListData';
import {type Key, type LoadingState, type Selection, type SelectionInput, type SortDescriptor} from './types';

export interface AsyncListOptions<T, C> {
  /** The keys for the initially selected items. */
  initialSelectedKeys?: SelectionInput,
  /** The initial sort descriptor. */
  initialSortDescriptor?: SortDescriptor,
  /** The initial filter text. */
  initialFilterText?: string,
  /** A function that returns a unique key for an item object. */
  getKey?: (item: T) => Key,
  /** A function that loads the data for the items in the list. */
  load: AsyncListLoadFunction<T, C>,
  /**
   * An optional function that performs sorting. If not provided,
   * then `sortDescriptor` is passed to the `load` function.
   */
  sort?: AsyncListLoadFunction<T, C, AsyncListLoadOptions<T, C> & {sortDescriptor: SortDescriptor}>
}

type AsyncListLoadFunction<T, C, S extends AsyncListLoadOptions<T, C> = AsyncListLoadOptions<T, C>> =
  (state: S) => AsyncListStateUpdate<T, C> | Promise<AsyncListStateUpdate<T, C>>;

interface AsyncListLoadOptions<T, C> {
  /** The items currently in the list. */
  items: T[],
  /** The keys of the currently selected items in the list. */
  selectedKeys: Selection,
  /** The current sort descriptor for the list. */
  sortDescriptor?: SortDescriptor,
  /** An abort signal used to notify the load function that the request has been aborted. */
  signal: AbortSignal,
  /** The pagination cursor returned from the last page load. */
  cursor?: C,
  /** The current filter text used to perform server side filtering. */
  filterText?: string,
  /** The current loading state of the list. */
  loadingState?: LoadingState
}

interface AsyncListStateUpdate<T, C> {
  /** The new items to append to the list. */
  items: Iterable<T>,
  /** The keys to add to the selection. */
  selectedKeys?: SelectionInput,
  /** The sort descriptor to set. */
  sortDescriptor?: SortDescriptor,
  /** The pagination cursor to be used for the next page load. */
  cursor?: C,
  /** The updated filter text for the list. */
  filterText?: string
}

interface AsyncListState<T, C> extends ListState<T> {
  abortController?: AbortController,
  cursor?: C,
  error?: Error,
  sortDescriptor?: SortDescriptor,
  state: LoadingState
}

type ActionType = 'error' | 'filtering' | 'loading' | 'loadingMore' | 'sorting' | 'success' | 'update';

interface Action<T, C> {
  abortController?: AbortController,
  cursor?: C,
  error?: Error,
  filterText?: string,
  items?: Iterable<T>,
  selectedKeys?: SelectionInput,
  sortDescriptor?: SortDescriptor,
  type: ActionType,
  updater?: (state: ListState<T>) => ListState<T>
}

export interface AsyncListData<T> {
  /** The items in the list. */
  items: Readonly<Ref<T[]>>,
  /** The selected keys in the list. */
  selectedKeys: Readonly<Ref<Selection>>,
  /** The current sort descriptor. */
  sortDescriptor: Readonly<Ref<SortDescriptor | undefined>>,
  /** Whether data is currently being loaded. */
  isLoading: Readonly<Ref<boolean>>,
  /** The current loading state for the list. */
  loadingState: Readonly<Ref<LoadingState>>,
  /** If loading data failed, then this contains the error that occurred. */
  error: Readonly<Ref<Error | undefined>>,
  /** The current filter text. */
  filterText: Readonly<Ref<string>>,
  /**
   * Gets an item from the list by key.
   * @param key - The key of the item to retrieve.
   */
  getItem(key: Key): T | undefined,
  /** Sets the selected keys. */
  setSelectedKeys(keys: SelectionInput): void,
  /** Adds the given keys to the current selected keys. */
  addKeysToSelection(keys: SelectionInput): void,
  /** Removes the given keys from the current selected keys. */
  removeKeysFromSelection(keys: SelectionInput): void,
  /** Inserts items into the list at the given index. */
  insert(index: number, ...values: T[]): void,
  /** Inserts items into the list before the item at the given key. */
  insertBefore(key: Key, ...values: T[]): void,
  /** Inserts items into the list after the item at the given key. */
  insertAfter(key: Key, ...values: T[]): void,
  /** Appends items to the list. */
  append(...values: T[]): void,
  /** Prepends items to the list. */
  prepend(...values: T[]): void,
  /** Removes items from the list by their keys. */
  remove(...keys: Key[]): void,
  /** Removes all selected items from the list. */
  removeSelectedItems(): void,
  /** Moves an item within the list. */
  move(key: Key, toIndex: number): void,
  /** Moves one or more items before a given key. */
  moveBefore(key: Key, keys: Iterable<Key>): void,
  /** Moves one or more items after a given key. */
  moveAfter(key: Key, keys: Iterable<Key>): void,
  /** Updates an item in the list. */
  update(key: Key, newValue: T | ((prev: T) => T)): void,
  /** Reloads the data in the list. */
  reload(): void,
  /** Loads the next page of data in the list. */
  loadMore(): void,
  /** Triggers sorting for the list. */
  sort(descriptor: SortDescriptor): void,
  /** Sets the filter text and fetches a filtered result set. */
  setFilterText(filterText: string): void
}

function normalizeSelection(selection?: SelectionInput): Selection {
  if (selection === 'all') {
    return 'all';
  }

  return new Set(selection ?? []);
}

function reducer<T, C>(data: AsyncListState<T, C>, action: Action<T, C>): AsyncListState<T, C> {
  let selectedKeys: Selection;

  switch (data.state) {
    case 'idle':
    case 'error':
      switch (action.type) {
        case 'loading':
        case 'loadingMore':
        case 'sorting':
        case 'filtering':
          return {
            ...data,
            filterText: action.filterText ?? data.filterText,
            state: action.type,
            items: action.type === 'loading' ? [] : data.items,
            sortDescriptor: action.sortDescriptor ?? data.sortDescriptor,
            abortController: action.abortController
          };
        case 'update':
          return {
            ...data,
            ...action.updater?.(data)
          };
        case 'success':
        case 'error':
          return data;
        default:
          throw new Error(`Invalid action "${action.type}" in state "${data.state}"`);
      }
    case 'loading':
    case 'sorting':
    case 'filtering':
      switch (action.type) {
        case 'success':
          if (action.abortController !== data.abortController) {
            return data;
          }

          selectedKeys = action.selectedKeys == null ? data.selectedKeys : normalizeSelection(action.selectedKeys);
          return {
            ...data,
            filterText: action.filterText ?? data.filterText,
            state: 'idle',
            items: [...(action.items ?? [])],
            selectedKeys: selectedKeys === 'all' ? 'all' : new Set(selectedKeys),
            sortDescriptor: action.sortDescriptor ?? data.sortDescriptor,
            abortController: undefined,
            cursor: action.cursor
          };
        case 'error':
          if (action.abortController !== data.abortController) {
            return data;
          }

          return {
            ...data,
            state: 'error',
            error: action.error,
            abortController: undefined
          };
        case 'loading':
        case 'loadingMore':
        case 'sorting':
        case 'filtering':
          data.abortController?.abort('aborting current load and starting new one');
          return {
            ...data,
            filterText: action.filterText ?? data.filterText,
            state: action.type,
            items: action.type === 'loading' ? [] : data.items,
            abortController: action.abortController
          };
        case 'update':
          return {
            ...data,
            ...action.updater?.(data)
          };
        default:
          throw new Error(`Invalid action "${action.type}" in state "${data.state}"`);
      }
    case 'loadingMore':
      switch (action.type) {
        case 'success':
          if (data.selectedKeys === 'all' || action.selectedKeys === 'all') {
            selectedKeys = 'all';
          } else {
            selectedKeys = new Set([...data.selectedKeys, ...(action.selectedKeys ?? [])]);
          }

          return {
            ...data,
            state: 'idle',
            items: [...data.items, ...(action.items ?? [])],
            selectedKeys,
            sortDescriptor: action.sortDescriptor ?? data.sortDescriptor,
            abortController: undefined,
            cursor: action.cursor
          };
        case 'error':
          if (action.abortController !== data.abortController) {
            return data;
          }

          return {
            ...data,
            state: 'error',
            error: action.error
          };
        case 'loading':
        case 'sorting':
        case 'filtering':
          data.abortController?.abort();
          return {
            ...data,
            filterText: action.filterText ?? data.filterText,
            state: action.type,
            items: action.type === 'loading' ? [] : data.items,
            abortController: action.abortController
          };
        case 'loadingMore':
          action.abortController?.abort();
          return data;
        case 'update':
          return {
            ...data,
            ...action.updater?.(data)
          };
        default:
          throw new Error(`Invalid action "${action.type}" in state "${data.state}"`);
      }
    default:
      throw new Error(`Invalid state "${data.state}"`);
  }
}

/**
 * Manages state for an immutable async loaded list data structure, and provides convenience methods to
 * update the data over time. Manages loading and error states, pagination, and sorting.
 */
export function useAsyncList<T, C = string>(options: AsyncListOptions<T, C>): AsyncListData<T> {
  let {
    load,
    sort,
    initialSelectedKeys,
    initialSortDescriptor,
    getKey = (item: any) => item.id ?? item.key,
    initialFilterText = ''
  } = options;

  let data = shallowRef<AsyncListState<T, C>>({
    state: 'idle',
    error: undefined,
    items: [],
    selectedKeys: normalizeSelection(initialSelectedKeys),
    sortDescriptor: initialSortDescriptor,
    filterText: initialFilterText
  });

  let dispatch = (action: Action<T, C>): void => {
    data.value = reducer(data.value, action);
  };

  let dispatchFetch = async (action: Action<T, C>, fn: AsyncListLoadFunction<T, C>): Promise<void> => {
    let abortController = new AbortController();
    let previousData = data.value;

    try {
      dispatch({...action, abortController});
      let previousFilterText = action.filterText ?? previousData.filterText;

      let response = await fn({
        items: previousData.items.slice(),
        selectedKeys: previousData.selectedKeys,
        sortDescriptor: action.sortDescriptor ?? previousData.sortDescriptor,
        signal: abortController.signal,
        cursor: action.type === 'loadingMore' ? previousData.cursor : undefined,
        filterText: previousFilterText,
        loadingState: previousData.state
      });

      let filterText = response.filterText ?? previousFilterText;
      dispatch({type: 'success', ...response, abortController});

      if (filterText && filterText !== previousFilterText && !abortController.signal.aborted) {
        await dispatchFetch({type: 'filtering', filterText}, load);
      }
    } catch (error) {
      dispatch({type: 'error', error: error as Error, abortController});
    }
  };

  void dispatchFetch({type: 'loading'}, load);

  return {
    items: computed(() => data.value.items),
    selectedKeys: computed(() => data.value.selectedKeys),
    sortDescriptor: computed(() => data.value.sortDescriptor),
    isLoading: computed(() => {
      return data.value.state === 'filtering'
        || data.value.state === 'loading'
        || data.value.state === 'loadingMore'
        || data.value.state === 'sorting';
    }),
    loadingState: computed(() => data.value.state),
    error: computed(() => data.value.error),
    filterText: computed(() => data.value.filterText),
    getItem(key: Key) {
      return data.value.items.find((item) => getKey(item) === key);
    },
    reload() {
      void dispatchFetch({type: 'loading'}, load);
    },
    loadMore() {
      if (data.value.state === 'loading' || data.value.state === 'loadingMore' || data.value.state === 'filtering' || data.value.cursor == null) {
        return;
      }

      void dispatchFetch({type: 'loadingMore'}, load);
    },
    sort(sortDescriptor: SortDescriptor) {
      void dispatchFetch({type: 'sorting', sortDescriptor}, (sort || load) as AsyncListLoadFunction<T, C>);
    },
    ...createListActions({...options, getKey, cursor: data.value.cursor}, (updater) => {
      dispatch({type: 'update', updater});
    }),
    setFilterText(filterText: string) {
      void dispatchFetch({type: 'filtering', filterText}, load);
    }
  };
}
