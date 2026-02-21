import {
  type AriaTableCellProps,
  type TableCellAria,
  useTableCell as useTableCellInternal
} from './useTableCell';
import {
  type AriaTableColumnHeaderProps,
  type TableColumnHeaderAria,
  type TableSortDirection,
  useTableColumnHeader as useTableColumnHeaderInternal
} from './useTableColumnHeader';
import {
  type AriaTableColumnResizeProps,
  type TableColumnResizeAria,
  useTableColumnResize as useTableColumnResizeInternal
} from './useTableColumnResize';
import {
  type AriaTableHeaderRowProps,
  type TableHeaderRowAria,
  useTableHeaderRow as useTableHeaderRowInternal
} from './useTableHeaderRow';
import {
  type AriaTableOptions,
  useTable as useTableInternal
} from './useTable';
import {
  type AriaTableRowProps,
  type TableRowAria,
  useTableRow as useTableRowInternal
} from './useTableRow';
import {
  type AriaTableSelectAllCheckboxOptions,
  type AriaTableSelectionCheckboxOptions,
  type TableSelectAllCheckboxAria,
  type TableSelectionCheckboxAria,
  useTableSelectAllCheckbox as useTableSelectAllCheckboxInternal,
  useTableSelectionCheckbox as useTableSelectionCheckboxInternal
} from './useTableSelectionCheckbox';
import type {GridAria, GridRowAria, GridRowGroupAria, GridRowProps} from '@vue-aria/grid';
import {useTableRowGroup as useTableRowGroupInternal} from './useTableRowGroup';

type AnyRecord = Record<string, unknown>;
type RefObject<T> = {current: T};
type FocusableElement = Element;
type TableState<T> = AnyRecord;
type TreeGridState<T> = AnyRecord;
type TableColumnResizeState<T> = AnyRecord;

export type {AriaTableOptions};
export type AriaTableProps = AriaTableOptions;
export type {AriaTableCellProps, TableCellAria};
export type {AriaTableColumnHeaderProps, TableColumnHeaderAria, TableSortDirection};
export type {AriaTableColumnResizeProps, TableColumnResizeAria};
export type {AriaTableHeaderRowProps, TableHeaderRowAria};
export type {AriaTableRowProps, TableRowAria};
export type {
  AriaTableSelectAllCheckboxOptions,
  AriaTableSelectionCheckboxOptions,
  TableSelectAllCheckboxAria,
  TableSelectionCheckboxAria
};
export type AriaTableSelectionCheckboxProps = AriaTableSelectionCheckboxOptions;
export type {GridAria, GridRowAria, GridRowProps, GridRowGroupAria};

export function useTable<T>(
  props: AriaTableProps,
  state: TableState<T> | TreeGridState<T>,
  ref: RefObject<HTMLElement | null>
): GridAria;
export function useTable(options: AriaTableOptions): GridAria;
export function useTable(options: AriaTableOptions): GridAria {
  return useTableInternal(options);
}

export function useTableColumnHeader<T>(
  props: AriaTableColumnHeaderProps<T>,
  state: TableState<T>,
  ref: RefObject<FocusableElement | null>
): TableColumnHeaderAria;
export function useTableColumnHeader(options: AriaTableColumnHeaderProps): TableColumnHeaderAria;
export function useTableColumnHeader(options: AriaTableColumnHeaderProps): TableColumnHeaderAria {
  return useTableColumnHeaderInternal(options);
}

export function useTableRow<T>(
  props: GridRowProps<T>,
  state: TableState<T> | TreeGridState<T>,
  ref: RefObject<FocusableElement | null>
): GridRowAria;
export function useTableRow(options: AriaTableRowProps): TableRowAria;
export function useTableRow(options: AriaTableRowProps): TableRowAria {
  return useTableRowInternal(options);
}

export function useTableHeaderRow<T>(
  props: GridRowProps<T>,
  state: TableState<T>,
  ref: RefObject<Element | null>
): TableHeaderRowAria;
export function useTableHeaderRow(options: AriaTableHeaderRowProps): TableHeaderRowAria;
export function useTableHeaderRow(options: AriaTableHeaderRowProps): TableHeaderRowAria {
  return useTableHeaderRowInternal(options);
}

export function useTableCell<T>(
  props: AriaTableCellProps,
  state: TableState<T>,
  ref: RefObject<FocusableElement | null>
): TableCellAria;
export function useTableCell(options: AriaTableCellProps): TableCellAria;
export function useTableCell(options: AriaTableCellProps): TableCellAria {
  return useTableCellInternal(options);
}

export function useTableSelectionCheckbox<T>(
  props: AriaTableSelectionCheckboxProps,
  state: TableState<T>
): TableSelectionCheckboxAria;
export function useTableSelectionCheckbox(options: AriaTableSelectionCheckboxOptions): TableSelectionCheckboxAria;
export function useTableSelectionCheckbox(options: AriaTableSelectionCheckboxOptions): TableSelectionCheckboxAria {
  return useTableSelectionCheckboxInternal(options);
}

export function useTableSelectAllCheckbox<T>(state: TableState<T>): TableSelectAllCheckboxAria;
export function useTableSelectAllCheckbox(options: AriaTableSelectAllCheckboxOptions): TableSelectAllCheckboxAria;
export function useTableSelectAllCheckbox(options: AriaTableSelectAllCheckboxOptions): TableSelectAllCheckboxAria {
  return useTableSelectAllCheckboxInternal(options);
}

export function useTableColumnResize<T>(
  props: AriaTableColumnResizeProps<T>,
  state: TableColumnResizeState<T>,
  ref: RefObject<HTMLInputElement | null>
): TableColumnResizeAria;
export function useTableColumnResize(options: AriaTableColumnResizeProps): TableColumnResizeAria;
export function useTableColumnResize(options: AriaTableColumnResizeProps): TableColumnResizeAria {
  return useTableColumnResizeInternal(options);
}

export function useTableRowGroup(): GridRowGroupAria;
export function useTableRowGroup() {
  return useTableRowGroupInternal();
}
