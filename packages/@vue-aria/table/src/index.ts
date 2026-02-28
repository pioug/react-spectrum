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
import {computed} from 'vue';
import {useTableRowGroup as useTableRowGroupInternal} from './useTableRowGroup';

type AnyRecord = Record<string, unknown>;
type RefObject<T> = {current: T};
type FocusableElement = Element;
type TableState<T> = AnyRecord;
type TreeGridState<T> = AnyRecord;
type TableColumnResizeState<T> = AnyRecord;

function toSet(values: unknown): Set<string | number> {
  if (!values || typeof values !== 'object') {
    return new Set();
  }

  if (values instanceof Set) {
    return new Set(values);
  }

  if (Symbol.iterator in values) {
    return new Set(Array.from(values as Iterable<string | number>));
  }

  return new Set();
}

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
export function useTable(
  options: AriaTableOptions,
  state?: TableState<unknown> | TreeGridState<unknown>,
  refObject?: RefObject<HTMLElement | null>
): GridAria {
  if (state) {
    void refObject;
    let stateRecord = state as AnyRecord;
    let optionsRecord = options as AnyRecord;
    let selectionManager = (stateRecord.selectionManager ?? {}) as AnyRecord;

    let focusedKey = computed<string | number | null>({
      get: () => {
        let key = selectionManager.focusedKey;
        return key == null ? null : (key as string | number);
      },
      set: (key) => {
        let setFocusedKey = selectionManager.setFocusedKey;
        if (typeof setFocusedKey === 'function') {
          setFocusedKey(key);
          return;
        }

        selectionManager.focusedKey = key;
      }
    });

    let selectedKeys = computed<Set<string | number>>({
      get: () => toSet(selectionManager.selectedKeys),
      set: (keys) => {
        let nextKeys = new Set(keys);
        let setSelectedKeys = selectionManager.setSelectedKeys;
        if (typeof setSelectedKeys === 'function') {
          setSelectedKeys(nextKeys);
          return;
        }

        selectionManager.selectedKeys = nextKeys;
      }
    });

    return useTableInternal({
      ...options,
      collection: stateRecord.collection,
      disabledKeys: stateRecord.disabledKeys,
      focusedKey,
      selectedKeys,
      selectionMode: selectionManager.selectionMode ?? optionsRecord.selectionMode,
      onRowAction: (optionsRecord.onRowAction as ((key: string | number) => void) | undefined)
        ?? (optionsRecord.onAction as ((key: string | number) => void) | undefined)
    });
  }

  return useTableInternal(options);
}

export function useTableColumnHeader<T>(
  props: AriaTableColumnHeaderProps<T>,
  state: TableState<T>,
  ref: RefObject<FocusableElement | null>
): TableColumnHeaderAria;
export function useTableColumnHeader(options: AriaTableColumnHeaderProps): TableColumnHeaderAria;
export function useTableColumnHeader(
  options: AriaTableColumnHeaderProps,
  state?: TableState<unknown>,
  refObject?: RefObject<FocusableElement | null>
): TableColumnHeaderAria {
  if (state) {
    let stateRecord = state as AnyRecord;
    let optionsRecord = options as AnyRecord;
    let node = (optionsRecord.node ?? {}) as AnyRecord;
    let nodeProps = (node.props ?? {}) as AnyRecord;

    let table = useTable({
      ariaLabel: (optionsRecord['aria-label'] as string | undefined) ?? (optionsRecord.ariaLabel as string | undefined) ?? 'table',
      collection: stateRecord.collection,
      disabledKeys: stateRecord.disabledKeys,
      onRowAction: optionsRecord.onAction as ((key: string | number) => void) | undefined
    }, stateRecord, refObject as RefObject<HTMLElement | null> | undefined);

    let sortDescriptor = computed(() => {
      let descriptor = stateRecord.sortDescriptor as AnyRecord | undefined;
      if (!descriptor || descriptor.column !== node.key) {
        return undefined;
      }

      let direction = descriptor.direction;
      return direction === 'ascending' || direction === 'descending' ? direction : undefined;
    });

    return useTableColumnHeaderInternal({
      allowsSorting: Boolean(nodeProps.allowsSorting),
      colSpan: typeof node.colSpan === 'number' ? node.colSpan : undefined,
      columnKey: node.key as string | number,
      onSort: (columnKey) => {
        let sort = stateRecord.sort;
        if (typeof sort === 'function') {
          sort(columnKey);
        }
      },
      sortDirection: sortDescriptor,
      table
    });
  }

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
