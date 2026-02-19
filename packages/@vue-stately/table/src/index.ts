export {TableCollection} from './TableCollection';
export type {
  TableCell,
  TableCollectionOptions,
  TableColumn,
  TableRow
} from './TableCollection';
export {UNSTABLE_useFilteredTableState, useTableState} from './useTableState';
export type {
  SortDescriptor,
  SortDirection,
  TableState,
  TableStateProps
} from './useTableState';
export {Section} from '@vue-stately/collections';

export type TableColumnResizeStateProps = Record<string, unknown>;
export interface TableColumnResizeState {
  columnWidths: Map<string | number, number>,
  startResize: (columnKey: string | number, width: number) => void,
  updateResize: (columnKey: string | number, width: number) => void,
  endResize: (columnKey: string | number) => void
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

export function useTableColumnResizeState(): TableColumnResizeState {
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

export function buildHeaderRows<T>(columns: TableColumn[]): Array<TableRow<T>> {
  return columns.length > 0
    ? [{
      key: 'header-row',
      cells: columns.map((column) => ({
        key: `header-${String(column.key)}`,
        textValue: column.title
      }))
    }]
    : [];
}

export function UNSTABLE_useTreeGridState<T>(props: TreeGridStateProps<T>): TreeGridState<T> {
  let state = useTableState(props);
  return {
    ...state,
    expandedKeys: new Set()
  };
}
