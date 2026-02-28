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

function resolveAriaLabel(optionsRecord: AnyRecord): string | undefined {
  return (optionsRecord['aria-label'] as string | undefined) ?? (optionsRecord.ariaLabel as string | undefined);
}

function getCollectionRows(collection: unknown): AnyRecord[] {
  if (!collection || typeof collection !== 'object') {
    return [];
  }

  let collectionRecord = collection as AnyRecord;
  let rows = collectionRecord.rows;
  if (Array.isArray(rows)) {
    return rows as AnyRecord[];
  }

  return [];
}

function findCollectionRow(collection: unknown, key: unknown): AnyRecord | undefined {
  if (!collection || typeof collection !== 'object') {
    return undefined;
  }

  let collectionRecord = collection as AnyRecord;
  let getItem = collectionRecord.getItem;
  if (typeof getItem === 'function') {
    let match = getItem(key);
    if (match && typeof match === 'object') {
      return match as AnyRecord;
    }
  }

  let rows = getCollectionRows(collection);
  return rows.find((row) => row.key === key);
}

function createTableFromState(
  optionsRecord: AnyRecord,
  stateRecord: AnyRecord,
  refObject?: RefObject<HTMLElement | null>
): GridAria {
  return useTable({
    ariaLabel: resolveAriaLabel(optionsRecord) ?? 'table',
    collection: stateRecord.collection,
    disabledKeys: stateRecord.disabledKeys
  }, stateRecord, refObject);
}

function isTableSelectAllState(value: unknown): value is AnyRecord {
  if (!value || typeof value !== 'object') {
    return false;
  }

  let record = value as AnyRecord;
  return 'collection' in record && 'selectionManager' in record;
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
export function useTableRow(
  options: AriaTableRowProps,
  state?: TableState<unknown> | TreeGridState<unknown>,
  refObject?: RefObject<FocusableElement | null>
): TableRowAria {
  if (state) {
    let stateRecord = state as AnyRecord;
    let optionsRecord = options as AnyRecord;
    let row = (optionsRecord.node ?? optionsRecord.row ?? {}) as AnyRecord;
    let rowProps = (row.props ?? {}) as AnyRecord;
    let onAction = optionsRecord.onAction as (() => void) | undefined;
    let onRowAction = rowProps.onAction as (() => void) | undefined;
    let table = createTableFromState(optionsRecord, stateRecord, refObject as RefObject<HTMLElement | null> | undefined);

    return useTableRowInternal({
      grid: table,
      isVirtualized: optionsRecord.isVirtualized as boolean | undefined,
      onAction: (typeof onAction === 'function' || typeof onRowAction === 'function')
        ? () => {
          onRowAction?.();
          onAction?.();
        }
        : undefined,
      row,
      shouldSelectOnPressUp: optionsRecord.shouldSelectOnPressUp as boolean | undefined
    });
  }

  return useTableRowInternal(options);
}

export function useTableHeaderRow<T>(
  props: GridRowProps<T>,
  state: TableState<T>,
  ref: RefObject<Element | null>
): TableHeaderRowAria;
export function useTableHeaderRow(options: AriaTableHeaderRowProps): TableHeaderRowAria;
export function useTableHeaderRow(
  options: AriaTableHeaderRowProps,
  state?: TableState<unknown>,
  refObject?: RefObject<Element | null>
): TableHeaderRowAria {
  if (state) {
    void state;
    void refObject;
    let optionsRecord = options as AnyRecord;
    return useTableHeaderRowInternal({
      isVirtualized: optionsRecord.isVirtualized as boolean | undefined,
      row: (optionsRecord.node ?? optionsRecord.row ?? {}) as AnyRecord
    });
  }

  return useTableHeaderRowInternal(options);
}

export function useTableCell<T>(
  props: AriaTableCellProps,
  state: TableState<T>,
  ref: RefObject<FocusableElement | null>
): TableCellAria;
export function useTableCell(options: AriaTableCellProps): TableCellAria;
export function useTableCell(
  options: AriaTableCellProps,
  state?: TableState<unknown>,
  refObject?: RefObject<FocusableElement | null>
): TableCellAria {
  if (state) {
    let stateRecord = state as AnyRecord;
    let optionsRecord = options as AnyRecord;
    let cell = (optionsRecord.node ?? optionsRecord.cell ?? {}) as AnyRecord;
    let row = findCollectionRow(stateRecord.collection, cell.parentKey)
      ?? (optionsRecord.row as AnyRecord | undefined)
      ?? {
        cells: [cell],
        index: typeof cell.index === 'number' ? cell.index : 0,
        key: (cell.parentKey as string | number | undefined) ?? (cell.key as string | number | undefined) ?? 'row'
      };
    let cellProps = (cell.props ?? {}) as AnyRecord;
    let onAction = optionsRecord.onAction as (() => void) | undefined;
    let onCellAction = cellProps.onAction as (() => void) | undefined;
    let table = createTableFromState(optionsRecord, stateRecord, refObject as RefObject<HTMLElement | null> | undefined);

    return useTableCellInternal({
      cell,
      colSpan: typeof cell.colSpan === 'number' ? cell.colSpan : undefined,
      grid: table,
      isVirtualized: optionsRecord.isVirtualized as boolean | undefined,
      onAction: (typeof onAction === 'function' || typeof onCellAction === 'function')
        ? () => {
          onCellAction?.();
          onAction?.();
        }
        : undefined,
      row,
      shouldSelectOnPressUp: optionsRecord.shouldSelectOnPressUp as boolean | undefined
    });
  }

  return useTableCellInternal(options);
}

export function useTableSelectionCheckbox<T>(
  props: AriaTableSelectionCheckboxProps,
  state: TableState<T>
): TableSelectionCheckboxAria;
export function useTableSelectionCheckbox(options: AriaTableSelectionCheckboxOptions): TableSelectionCheckboxAria;
export function useTableSelectionCheckbox(
  options: AriaTableSelectionCheckboxOptions,
  state?: TableState<unknown>
): TableSelectionCheckboxAria {
  if (state) {
    let stateRecord = state as AnyRecord;
    let optionsRecord = options as AnyRecord;
    let table = createTableFromState(optionsRecord, stateRecord);
    return useTableSelectionCheckboxInternal({
      ariaLabel: resolveAriaLabel(optionsRecord),
      grid: table,
      key: optionsRecord.key as string | number,
      rowLabelledBy: optionsRecord.rowLabelledBy as string | undefined
    });
  }

  return useTableSelectionCheckboxInternal(options);
}

export function useTableSelectAllCheckbox<T>(state: TableState<T>): TableSelectAllCheckboxAria;
export function useTableSelectAllCheckbox(options: AriaTableSelectAllCheckboxOptions): TableSelectAllCheckboxAria;
export function useTableSelectAllCheckbox(
  options: AriaTableSelectAllCheckboxOptions | TableState<unknown>
): TableSelectAllCheckboxAria {
  if (isTableSelectAllState(options) && !('keys' in options) && !('selectedKeys' in options)) {
    let stateRecord = options as AnyRecord;
    let selectionManager = (stateRecord.selectionManager ?? {}) as AnyRecord;
    let rowKeys = computed(() => {
      return getCollectionRows(stateRecord.collection)
        .filter((row) => row.type !== 'loader')
        .map((row) => row.key as string | number);
    });
    let isCollectionEmpty = computed(() => {
      let size = (stateRecord.collection as AnyRecord | undefined)?.size;
      if (typeof size === 'number') {
        return size === 0;
      }

      return rowKeys.value.length === 0;
    });
    let hasSingleLoaderRow = computed(() => {
      let rows = getCollectionRows(stateRecord.collection);
      return rows.length === 1 && rows[0]?.type === 'loader';
    });
    let selectionMode = computed(() => {
      let mode = selectionManager.selectionMode as string | undefined;
      return mode === 'none' || mode === 'single' || mode === 'multiple' ? mode : 'multiple';
    });
    let checked = computed(() => Boolean(selectionManager.isSelectAll));
    let isEmpty = computed(() => Boolean(selectionManager.isEmpty));
    let disabled = computed(() => {
      return selectionMode.value !== 'multiple' || isCollectionEmpty.value || hasSingleLoaderRow.value;
    });

    let toggleSelectAll = () => {
      if (disabled.value) {
        return;
      }

      let toggle = selectionManager.toggleSelectAll;
      if (typeof toggle === 'function') {
        toggle();
        return;
      }

      let setSelectedKeys = selectionManager.setSelectedKeys;
      let next = checked.value ? new Set<string | number>() : new Set(rowKeys.value);
      if (typeof setSelectedKeys === 'function') {
        setSelectedKeys(next);
        return;
      }

      selectionManager.selectedKeys = next;
    };

    return {
      checkboxProps: computed(() => ({
        'aria-label': selectionMode.value === 'single' ? 'Select' : 'Select all',
        checked: checked.value,
        disabled: disabled.value,
        indeterminate: !isEmpty.value && !checked.value,
        onChange: toggleSelectAll
      })),
      toggleSelectAll
    };
  }

  return useTableSelectAllCheckboxInternal(options as AriaTableSelectAllCheckboxOptions);
}

export function useTableColumnResize<T>(
  props: AriaTableColumnResizeProps<T>,
  state: TableColumnResizeState<T>,
  ref: RefObject<HTMLInputElement | null>
): TableColumnResizeAria;
export function useTableColumnResize(options: AriaTableColumnResizeProps): TableColumnResizeAria;
export function useTableColumnResize(
  options: AriaTableColumnResizeProps,
  state?: TableColumnResizeState<unknown>,
  refObject?: RefObject<HTMLInputElement | null>
): TableColumnResizeAria {
  if (state) {
    void refObject;
    let stateRecord = state as AnyRecord;
    let optionsRecord = options as AnyRecord;
    let column = (optionsRecord.column ?? {}) as AnyRecord;
    let columnKey = column.key as string | number;
    let latestWidths: unknown;
    let readResizedColumns = () => {
      if (latestWidths instanceof Map) {
        return latestWidths as Map<string | number, unknown>;
      }

      let resizedColumns = stateRecord.resizedColumns;
      if (resizedColumns instanceof Map) {
        return resizedColumns as Map<string | number, unknown>;
      }

      return new Map<string | number, unknown>();
    };

    let width = computed<number>({
      get: () => {
        let getColumnWidth = stateRecord.getColumnWidth;
        if (typeof getColumnWidth === 'function') {
          let nextWidth = Number(getColumnWidth(columnKey));
          if (Number.isFinite(nextWidth)) {
            return nextWidth;
          }
        }

        return 0;
      },
      set: (nextWidth) => {
        let updateResizedColumns = stateRecord.updateResizedColumns;
        if (typeof updateResizedColumns === 'function') {
          latestWidths = updateResizedColumns(columnKey, nextWidth);
        }
      }
    });
    let minWidth = computed<number | undefined>(() => {
      let getColumnMinWidth = stateRecord.getColumnMinWidth;
      if (typeof getColumnMinWidth === 'function') {
        let nextMin = Number(getColumnMinWidth(columnKey));
        if (Number.isFinite(nextMin)) {
          return nextMin;
        }
      }

      return undefined;
    });
    let maxWidth = computed<number | undefined>(() => {
      let getColumnMaxWidth = stateRecord.getColumnMaxWidth;
      if (typeof getColumnMaxWidth === 'function') {
        let nextMax = Number(getColumnMaxWidth(columnKey));
        if (Number.isFinite(nextMax)) {
          return nextMax;
        }
      }

      return undefined;
    });

    let resize = useTableColumnResizeInternal({
      'aria-label': resolveAriaLabel(optionsRecord),
      isDisabled: optionsRecord.isDisabled as boolean | undefined,
      maxWidth,
      minWidth,
      onResize: () => {
        let onResize = optionsRecord.onResize;
        if (typeof onResize === 'function') {
          onResize(readResizedColumns());
        }
      },
      width
    });

    let onResizeStart = optionsRecord.onResizeStart;
    let onResizeEnd = optionsRecord.onResizeEnd;
    if (typeof onResizeStart !== 'function' && typeof onResizeEnd !== 'function') {
      return resize;
    }

    return {
      ...resize,
      resizerProps: computed(() => ({
        ...resize.resizerProps.value,
        onPointerDown: (event: PointerEvent) => {
          resize.resizerProps.value.onPointerDown(event);
          if (typeof onResizeStart === 'function') {
            onResizeStart(readResizedColumns());
          }
        },
        onPointerUp: (event?: PointerEvent) => {
          resize.resizerProps.value.onPointerUp(event);
          if (typeof onResizeEnd === 'function') {
            onResizeEnd(readResizedColumns());
          }
        }
      }))
    };
  }

  return useTableColumnResizeInternal(options);
}

export function useTableRowGroup(): GridRowGroupAria;
export function useTableRowGroup() {
  return useTableRowGroupInternal();
}
