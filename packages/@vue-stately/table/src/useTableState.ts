import {computed, type Ref, ref} from 'vue';
import {type GridCollection, type GridNode, type GridState, type Key, useGridState} from '@vue-stately/grid';
import {type TableCollection} from './TableCollection';

export type SortDirection = 'ascending' | 'descending';

export interface SortDescriptor {
  column: Key,
  direction: SortDirection
}

const OPPOSITE_SORT_DIRECTION: Record<SortDirection, SortDirection> = {
  ascending: 'descending',
  descending: 'ascending'
};

interface FilterableCollection<T> extends GridCollection<T> {
  filter?: (filterFn: (nodeValue: string, node: GridNode<T>) => boolean) => GridCollection<T>
}

export interface TableState<T> extends GridState<T, FilterableCollection<T>> {
  collection: FilterableCollection<T>,
  selectionMode: 'multiple' | 'none' | 'single',
  showSelectionCheckboxes: boolean,
  sortDescriptor: Ref<SortDescriptor | null>,
  setKeyboardNavigationDisabled: (value: boolean) => void,
  sort: (columnKey: Key, direction?: SortDirection) => void
}

export interface TableStateProps<T> {
  collection: FilterableCollection<T> | TableCollection<T>,
  disabledKeys?: Iterable<Key>,
  onSortChange?: (descriptor: SortDescriptor) => void,
  selectedKeys?: Ref<Set<Key>>,
  selectionMode?: 'multiple' | 'none' | 'single',
  showSelectionCheckboxes?: boolean,
  sortDescriptor?: Ref<SortDescriptor | null>
}

/**
 * Provides table state for row selection, sorting, and keyboard-navigation gating.
 */
export function useTableState<T>(props: TableStateProps<T>): TableState<T> {
  let selectionMode = props.selectionMode ?? 'none';
  let sortDescriptor = props.sortDescriptor ?? ref<SortDescriptor | null>(null);

  let gridState = useGridState<T, FilterableCollection<T>>({
    collection: props.collection,
    disabledKeys: props.disabledKeys,
    selectedKeys: props.selectedKeys,
    selectionMode
  });
  gridState.isKeyboardNavigationDisabled.value = props.collection.size === 0;

  let sort = (columnKey: Key, direction?: SortDirection): void => {
    let currentSort = sortDescriptor.value;
    let nextDirection = direction
      ?? (currentSort?.column === columnKey
        ? OPPOSITE_SORT_DIRECTION[currentSort.direction]
        : 'ascending');
    let nextSortDescriptor: SortDescriptor = {
      column: columnKey,
      direction: nextDirection
    };

    sortDescriptor.value = nextSortDescriptor;
    props.onSortChange?.(nextSortDescriptor);
  };

  return {
    ...gridState,
    collection: props.collection,
    selectionMode,
    showSelectionCheckboxes: Boolean(props.showSelectionCheckboxes) && selectionMode !== 'none',
    sortDescriptor,
    setKeyboardNavigationDisabled: (value) => {
      gridState.isKeyboardNavigationDisabled.value = value;
    },
    sort
  };
}

/**
 * Filters a table collection with the provided filter function.
 */
export function UNSTABLE_useFilteredTableState<T>(
  state: TableState<T>,
  filterFn: ((nodeValue: string, node: GridNode<T>) => boolean) | null | undefined
): TableState<T> {
  let filteredCollection = computed(() => {
    if (!filterFn || !state.collection.filter) {
      return state.collection;
    }

    return state.collection.filter(filterFn) as FilterableCollection<T>;
  });

  let nextGridState = useGridState<T, FilterableCollection<T>>({
    collection: filteredCollection.value,
    disabledKeys: state.disabledKeys,
    selectedKeys: state.selectionManager.selectedKeys,
    selectionMode: state.selectionMode
  });

  return {
    ...state,
    collection: filteredCollection.value,
    disabledKeys: nextGridState.disabledKeys,
    selectionManager: nextGridState.selectionManager
  };
}
