import {
  TableCollection,
  buildHeaderRows as buildHeaderRowsInternal,
  type TableCell,
  type TableCollectionOptions,
  type TableColumn,
  type TableRow
} from './TableCollection';
import {
  UNSTABLE_useFilteredTableState as unstableUseFilteredTableStateInternal,
  useTableState as useTableStateInternal,
  type SortDescriptor,
  type SortDirection,
  type TableState,
  type TableStateProps
} from './useTableState';
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
  endResize: (columnKey: string | number) => void
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
export interface TreeGridState<T = unknown> extends TableState<T> {
  expandedKeys: Set<string | number>
}
export type TreeGridStateProps<T = unknown> = TableStateProps<T> & {
  defaultExpandedKeys?: Iterable<string | number>
};

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
  return {
    ...state,
    expandedKeys: new Set()
  };
}
