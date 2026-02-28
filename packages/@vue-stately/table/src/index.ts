import {
  buildHeaderRows as buildHeaderRowsInternal,
  type TableCell,
  TableCollection,
  type TableCollectionOptions,
  type TableColumn,
  type TableRow
} from './TableCollection';
import {
  type SortDescriptor,
  type SortDirection,
  type TableState,
  type TableStateProps,
  UNSTABLE_useFilteredTableState as unstableUseFilteredTableStateInternal,
  useTableState as useTableStateInternal
} from './useTableState';
import {computed, type Ref, ref, watch} from 'vue';
export {Section} from '@vue-stately/collections';

export {TableCollection};
export type {
  TableCell,
  TableCollectionOptions,
  TableColumn,
  TableRow,
  SortDescriptor,
  SortDirection,
  TableState,
  TableStateProps
};

type Key = string | number;
type GridNode<T> = {
  key: Key
} & Record<string, unknown> & {
  _itemType?: T
};

export function useTableState<T extends object>(props: TableStateProps<T>): TableState<T>;
export function useTableState<T>(props: TableStateProps<T>): TableState<T>;
export function useTableState<T>(props: TableStateProps<T>): TableState<T> {
  return useTableStateInternal(props);
}

export function UNSTABLE_useFilteredTableState<T extends object>(
  props: TableStateProps<T>,
  filter: (rows: TableRow<T>[]) => TableRow<T>[]
): TableState<T>;
export function UNSTABLE_useFilteredTableState<T>(
  props: TableStateProps<T>,
  filter: (rows: TableRow<T>[]) => TableRow<T>[]
): TableState<T>;
export function UNSTABLE_useFilteredTableState<T>(
  props: TableStateProps<T>,
  filter: (rows: TableRow<T>[]) => TableRow<T>[]
): TableState<T> {
  return unstableUseFilteredTableStateInternal(props, filter);
}

export type TableColumnResizeStateProps<T = unknown> = Record<string, unknown> & {
  _tableType?: T
};
export interface TableColumnResizeState<T = unknown> {
  columnWidths: Map<string | number, number>,
  startResize: (columnKey: string | number, width: number) => void,
  updateResize: (columnKey: string | number, width: number) => void,
  endResize: (columnKey: string | number) => void,
  _tableType?: T
}

export type TableHeaderProps<T = unknown> = {
  items?: T[]
} & Record<string, unknown>;
export type TableBodyProps<T = unknown> = {
  items?: T[]
} & Record<string, unknown>;
export type ColumnProps<T = unknown> = {
  item?: T
} & Record<string, unknown>;
export type RowProps<T = unknown> = {
  item?: T
} & Record<string, unknown>;
export type CellProps<T = unknown> = {
  item?: T
} & Record<string, unknown>;

export const TableHeader = {name: 'VueStatelyTableHeader'};
export const TableBody = {name: 'VueStatelyTableBody'};
export const Column = {name: 'VueStatelyTableColumn'};
export const Row = {name: 'VueStatelyTableRow'};
export const Cell = {name: 'VueStatelyTableCell'};

export function useTableColumnResizeState<T>(
  _props?: TableColumnResizeStateProps<T>,
  _state?: TableState<T>
): TableColumnResizeState<T> {
  void _props;
  void _state;
  let columnWidths = new Map<string | number, number>();
  return {
    columnWidths,
    startResize: (columnKey, width) => {
      columnWidths.set(columnKey, width);
    },
    updateResize: (columnKey, width) => {
      columnWidths.set(columnKey, width);
    },
    endResize: () => {}
  };
}

export type CollectionBuilderContext = Record<string, unknown>;

type ExpandedKeys = 'all' | Set<string | number>;
type ExpandedKeysInput = 'all' | Iterable<string | number>;

export interface TreeGridState<T = unknown> extends TableState<T> {
  expandedKeys: ExpandedKeys,
  setExpandedKeys: (keys: ExpandedKeysInput | ExpandedKeys) => void,
  toggleKey: (key: string | number) => void
}
export type TreeGridStateProps<T = unknown> = TableStateProps<T> & {
  defaultExpandedKeys?: ExpandedKeysInput,
  UNSTABLE_defaultExpandedKeys?: ExpandedKeysInput,
  UNSTABLE_expandedKeys?: Ref<ExpandedKeysInput | undefined>,
  UNSTABLE_onExpandedChange?: (keys: Set<string | number>) => void
};

function normalizeExpandedKeys(expandedKeys: ExpandedKeysInput | ExpandedKeys | undefined): ExpandedKeys {
  if (expandedKeys === 'all') {
    return 'all';
  }

  return new Set(expandedKeys ?? []);
}

function expandedKeysEqual(a: ExpandedKeys, b: ExpandedKeys): boolean {
  if (a === 'all' || b === 'all') {
    return a === b;
  }

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

export class TableColumnLayout {
  private widths = new Map<string | number, number>();

  getColumnWidth(columnKey: string | number): number | undefined {
    return this.widths.get(columnKey);
  }

  setColumnWidth(columnKey: string | number, width: number): void {
    this.widths.set(columnKey, width);
  }
}

export function buildHeaderRows<T>(keyMap: Map<Key, GridNode<T>>, columnNodes: GridNode<T>[]): GridNode<T>[];
export function buildHeaderRows<T>(columns: TableColumn[]): Array<TableRow<T>>;
export function buildHeaderRows<T>(
  firstArg: Map<Key, GridNode<T>> | TableColumn[],
  secondArg?: GridNode<T>[]
): GridNode<T>[] | Array<TableRow<T>> {
  if (firstArg instanceof Map && Array.isArray(secondArg)) {
    return secondArg;
  }

  return buildHeaderRowsInternal(firstArg as TableColumn[]) as Array<TableRow<T>>;
}

export function UNSTABLE_useTreeGridState<T>(props: TreeGridStateProps<T>): TreeGridState<T> {
  let state = useTableState(props);
  let uncontrolledExpandedKeys = ref<ExpandedKeys>(normalizeExpandedKeys(
    props.UNSTABLE_defaultExpandedKeys ?? props.defaultExpandedKeys
  ));
  let isControlled = computed(() => props.UNSTABLE_expandedKeys !== undefined && props.UNSTABLE_expandedKeys.value !== undefined);
  let wasControlled = ref(isControlled.value);

  watch(isControlled, (nextIsControlled) => {
    if (wasControlled.value !== nextIsControlled && process.env.NODE_ENV !== 'production') {
      console.warn(`WARN: A component changed from ${wasControlled.value ? 'controlled' : 'uncontrolled'} to ${nextIsControlled ? 'controlled' : 'uncontrolled'}.`);
    }
    wasControlled.value = nextIsControlled;
  });

  let expandedKeys = computed<ExpandedKeys>({
    get: () => {
      if (isControlled.value && props.UNSTABLE_expandedKeys) {
        return normalizeExpandedKeys(props.UNSTABLE_expandedKeys.value);
      }

      return uncontrolledExpandedKeys.value;
    },
    set: (nextExpandedKeys) => {
      let normalizedExpandedKeys = normalizeExpandedKeys(nextExpandedKeys);
      if (isControlled.value && props.UNSTABLE_expandedKeys) {
        props.UNSTABLE_expandedKeys.value = normalizedExpandedKeys === 'all'
          ? 'all'
          : new Set(normalizedExpandedKeys);
      } else {
        uncontrolledExpandedKeys.value = normalizedExpandedKeys;
      }
    }
  });

  let treeGridState: TreeGridState<T>;
  let setExpandedKeys = (nextExpandedKeys: ExpandedKeysInput | ExpandedKeys): void => {
    let normalizedExpandedKeys = normalizeExpandedKeys(nextExpandedKeys);
    if (expandedKeysEqual(normalizedExpandedKeys, expandedKeys.value)) {
      return;
    }

    expandedKeys.value = normalizedExpandedKeys;
    if (treeGridState) {
      treeGridState.expandedKeys = normalizedExpandedKeys;
    }

    if (normalizedExpandedKeys !== 'all') {
      props.UNSTABLE_onExpandedChange?.(new Set(normalizedExpandedKeys));
    }
  };

  let toggleKey = (key: string | number): void => {
    if (expandedKeys.value === 'all') {
      setExpandedKeys(new Set());
      return;
    }

    let nextExpandedKeys = new Set(expandedKeys.value);
    if (nextExpandedKeys.has(key)) {
      nextExpandedKeys.delete(key);
    } else {
      nextExpandedKeys.add(key);
    }

    setExpandedKeys(nextExpandedKeys);
  };

  treeGridState = {
    ...state,
    expandedKeys: expandedKeys.value,
    setExpandedKeys,
    toggleKey
  };

  return treeGridState;
}
