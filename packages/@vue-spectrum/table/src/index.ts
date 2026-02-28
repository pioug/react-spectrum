import '@adobe/spectrum-css-temp/components/table/vars.css';
import './table.css';
import {
  Cell as StatelyCell,
  Column as StatelyColumn,
  Row as StatelyRow,
  Section as StatelySection,
  TableBody as StatelyTableBody,
  TableHeader as StatelyTableHeader,
  type CellProps as VueStatelyCellProps,
  type ColumnProps as VueStatelyColumnProps,
  type RowProps as VueStatelyRowProps,
  type TableBodyProps as VueStatelyTableBodyProps,
  type TableHeaderProps as VueStatelyTableHeaderProps
} from '@vue-stately/table';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref} from 'vue';
const styles: {[key: string]: string} = {};


const stylesOverrides: {[key: string]: string} = {};

type SelectionMode = 'multiple' | 'none' | 'single';
type SortDirection = 'ascending' | 'descending';
type SelectionKey = number | string;
type SelectionValue = SelectionKey | Iterable<SelectionKey>;
type TableLoadingState = 'filtering' | 'idle' | 'loading' | 'loadingMore';

type TableColumn = {
  align?: 'center' | 'end' | 'start',
  ariaLabel?: string,
  colspan?: number,
  hideHeader?: boolean,
  key: string,
  label?: string,
  level?: number,
  maxWidth?: number | string,
  minWidth?: number | string,
  posInSet?: number,
  resizable?: boolean,
  setSize?: number,
  showDivider?: boolean,
  width?: number | string,
  sortable?: boolean
};

type TableRow = Record<string, unknown> & {
  disabled?: boolean,
  id?: number | string,
  level?: number,
  open?: boolean,
  posInSet?: number,
  selected?: boolean,
  setSize?: number,
  visible?: boolean
};

type SortDescriptor = {
  column: string,
  direction: SortDirection
};

const NESTED_RESIZABLE_COLUMN_WARNING = (columnKey: string) => `Column key: ${columnKey}. Columns with child columns don't allow resizing.`;

let tableId = 0;

function isSelectionKey(value: unknown): value is SelectionKey {
  return typeof value === 'number' || typeof value === 'string';
}

function normalizeSelectionKeys(keys: Iterable<SelectionKey>): SelectionKey[] {
  return Array.from(keys).filter(isSelectionKey);
}

function normalizeSelectedValue(value: SelectionValue | undefined): SelectionKey[] {
  if (isSelectionKey(value)) {
    return [value];
  }

  if (value == null) {
    return [];
  }

  let maybeIterable = value as {[Symbol.iterator]?: (() => Iterator<unknown>) | undefined};
  if (typeof maybeIterable[Symbol.iterator] !== 'function') {
    return [];
  }

  return Array.from(value as Iterable<unknown>).filter(isSelectionKey);
}

function isSelectionValue(value: unknown): value is SelectionValue {
  if (isSelectionKey(value)) {
    return true;
  }

  if (value == null) {
    return false;
  }

  let maybeIterable = value as {[Symbol.iterator]?: (() => Iterator<unknown>) | undefined};
  if (typeof maybeIterable[Symbol.iterator] !== 'function') {
    return false;
  }

  for (let entry of value as Iterable<unknown>) {
    if (!isSelectionKey(entry)) {
      return false;
    }
  }

  return true;
}

function isSelectionIterable(value: unknown): value is Iterable<SelectionKey> {
  if (value == null) {
    return false;
  }

  let maybeIterable = value as {[Symbol.iterator]?: (() => Iterator<unknown>) | undefined};
  if (typeof maybeIterable[Symbol.iterator] !== 'function') {
    return false;
  }

  for (let entry of value as Iterable<unknown>) {
    if (!isSelectionKey(entry)) {
      return false;
    }
  }

  return true;
}

function toBooleanString(value: boolean): 'false' | 'true' {
  return value ? 'true' : 'false';
}

function getRowId(row: TableRow, index: number, rowKey: string): number | string {
  let rowId = row[rowKey];
  if (typeof rowId === 'number' || typeof rowId === 'string') {
    return rowId;
  }

  if (typeof row.id === 'number' || typeof row.id === 'string') {
    return row.id;
  }

  return index;
}

function getCellTextValue(row: TableRow, columnKey: string): string {
  let value = row[columnKey];
  if (value == null) {
    return '';
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  return String(value);
}

function alignToSpectrumToken(align: TableColumn['align']): 'Center' | 'End' | 'Start' {
  if (align === 'center') {
    return 'Center';
  }

  if (align === 'end') {
    return 'End';
  }

  return 'Start';
}

function toCssSize(value: number | string | undefined): string | undefined {
  if (typeof value === 'number') {
    return `${value}px`;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    return value;
  }

  return undefined;
}

function isLikelyUrl(text: string): boolean {
  return /^https?:\/\//i.test(text);
}

export const Table = defineComponent({
  name: 'VueTable',
  inheritAttrs: false,
  props: {
    ariaLabel: {
      type: String,
      default: ''
    },
    ariaLabelledby: {
      type: String,
      default: ''
    },
    caption: {
      type: String,
      default: ''
    },
    columns: {
      type: Array as PropType<TableColumn[]>,
      default: () => []
    },
    dataTestid: {
      type: String,
      default: ''
    },
    density: {
      type: String as PropType<'compact' | 'regular' | 'spacious'>,
      default: 'regular'
    },
    disabledKeys: {
      type: [Array, Set] as PropType<Iterable<SelectionKey>>,
      default: () => []
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isQuiet: {
      type: Boolean,
      default: false
    },
    loadingState: {
      type: String as PropType<TableLoadingState>,
      default: 'idle'
    },
    modelValue: {
      type: [String, Number, Array, Set] as PropType<SelectionValue | undefined>,
      default: undefined
    },
    openKeys: {
      type: [Array, Set] as PropType<Iterable<number | string>>,
      default: () => []
    },
    overflowMode: {
      type: String as PropType<'truncate' | 'wrap'>,
      default: 'truncate'
    },
    resizableColumns: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    rows: {
      type: Array as PropType<TableRow[]>,
      default: () => []
    },
    selectionMode: {
      type: String as PropType<SelectionMode>,
      default: 'single'
    },
    sortDescriptor: {
      type: Object as PropType<SortDescriptor | undefined>,
      default: undefined
    },
    visibility: {
      type: String as PropType<'hidden' | 'visible' | undefined>,
      default: undefined
    }
  },
  emits: {
    openChange: (keys: Iterable<SelectionKey>) => isSelectionIterable(keys),
    rowAction: (row: TableRow) => typeof row === 'object' && row !== null,
    sortChange: (value: SortDescriptor) => typeof value === 'object' && value !== null,
    'update:modelValue': (value: SelectionValue) => {
      return isSelectionValue(value);
    }
  },
  setup(props, {emit, attrs}) {
    let warnedNestedResizableColumns = new Set<string>();
    let generatedId = `vs-table-${++tableId}`;
    let tableLabelId = computed(() => props.ariaLabelledby || (props.caption ? `${generatedId}-caption` : undefined));

    let hoveredRow = ref<number | string | null>(null);
    let focusedRow = ref<number | string | null>(null);
    let activeRow = ref<number | string | null>(null);
    let focusedResizer = ref<string | null>(null);

    let selectedSet = computed(() => new Set(normalizeSelectedValue(props.modelValue)));
    let disabledKeySet = computed(() => new Set(normalizeSelectionKeys(props.disabledKeys)));
    let openSet = computed(() => new Set(props.openKeys));
    let hasMultipleSelection = computed(() => props.selectionMode === 'multiple');
    let selectionColumnOffset = computed(() => hasMultipleSelection.value ? 1 : 0);
    let isRowDisabledByContract = (row: TableRow, rowId: SelectionKey) => (
      props.isDisabled ||
      !!row.disabled ||
      disabledKeySet.value.has(rowId)
    );
    let selectableRowIds = computed(() => props.rows.reduce<SelectionKey[]>((acc, row, rowIndex) => {
      let rowId = getRowId(row, rowIndex, props.rowKey);
      if (isRowDisabledByContract(row, rowId)) {
        return acc;
      }

      acc.push(rowId);
      return acc;
    }, []));
    let allRowsSelected = computed(() => {
      if (!hasMultipleSelection.value || selectableRowIds.value.length === 0) {
        return false;
      }

      return selectableRowIds.value.every((rowId) => selectedSet.value.has(rowId));
    });
    let someRowsSelected = computed(() => {
      if (!hasMultipleSelection.value || selectableRowIds.value.length === 0 || allRowsSelected.value) {
        return false;
      }

      return selectableRowIds.value.some((rowId) => selectedSet.value.has(rowId));
    });

    let onSelectRow = (row: TableRow, rowId: SelectionKey) => {
      if (isRowDisabledByContract(row, rowId)) {
        return;
      }

      if (props.selectionMode === 'none') {
        emit('rowAction', row);
        return;
      }

      if (props.selectionMode === 'single') {
        emit('update:modelValue', rowId);
        emit('rowAction', row);
        return;
      }

      let next = new Set(selectedSet.value);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }

      emit('update:modelValue', new Set(next));
      emit('rowAction', row);
    };

    let onToggleOpen = (row: TableRow, rowId: number | string) => {
      let childRows = row.children;
      if (!Array.isArray(childRows) || childRows.length === 0) {
        return;
      }

      let next = new Set(openSet.value);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }

      emit('openChange', new Set(next));
    };

    let onToggleSort = (column: TableColumn) => {
      if (!column.sortable) {
        return;
      }

      let previousDirection = props.sortDescriptor?.column === column.key
        ? props.sortDescriptor.direction
        : undefined;
      let direction: SortDirection = previousDirection === 'ascending' ? 'descending' : 'ascending';

      emit('sortChange', {
        column: column.key,
        direction
      });
    };

    let onToggleSelectAll = (isChecked: boolean) => {
      if (!hasMultipleSelection.value) {
        return;
      }

      if (!isChecked) {
        emit('update:modelValue', new Set<SelectionKey>());
        return;
      }

      emit('update:modelValue', new Set(selectableRowIds.value));
    };

    return () => {
      let rootClassName = classNames(
        styles,
        'spectrum-Table',
        `spectrum-Table--${props.density}`,
        {
          'react-spectrum-Table--loadingMore': props.loadingState === 'loadingMore',
          'spectrum-Table--quiet': props.isQuiet,
          'spectrum-Table--wrap': props.overflowMode === 'wrap',
          'is-disabled': props.isDisabled
        }
      );

      return h('div', {
        ...attrs,
        class: [rootClassName, classNames(stylesOverrides, 'react-spectrum-Table'), 'vs-table', attrs.class],
        role: 'grid',
        'aria-label': props.ariaLabel || attrs['aria-label'],
        'aria-labelledby': tableLabelId.value || attrs['aria-labelledby'],
        'data-testid': props.dataTestid || attrs['data-testid'],
        'data-loading-state': props.loadingState,
        style: [attrs.style, {visibility: props.visibility}],
        'data-vac': ''
      }, [
        h('table', {class: 'vs-table__table'}, [
          props.caption
            ? h('caption', {id: `${generatedId}-caption`, class: 'vs-table__caption'}, props.caption)
            : null,
          h('thead', {class: [classNames(styles, 'spectrum-Table-headWrapper'), 'vs-table__head'], role: 'rowgroup'}, [
            h('tr', {
              class: [classNames(styles, 'spectrum-Table-head'), 'vs-table__head-row'],
              role: 'row'
            }, [
              hasMultipleSelection.value
                ? h('th', {
                  key: '__selection__',
                  role: 'columnheader',
                  class: [
                    classNames(styles, 'spectrum-Table-headCell', 'spectrum-Table-checkboxCell'),
                    'vs-table__head-cell',
                    'vs-table__head-cell--selection'
                  ],
                  'aria-colindex': 1
                }, [
                  h('input', {
                    class: [classNames(styles, 'spectrum-Table-checkbox'), 'vs-table__selection-checkbox'],
                    type: 'checkbox',
                    checked: allRowsSelected.value,
                    disabled: props.isDisabled || selectableRowIds.value.length === 0,
                    'aria-label': 'Select all',
                    ref: (element: Element | null) => {
                      if (element instanceof HTMLInputElement) {
                        element.indeterminate = someRowsSelected.value && !allRowsSelected.value;
                      }
                    },
                    onClick: (event: Event) => {
                      event.stopPropagation();
                    },
                    onMousedown: (event: Event) => {
                      event.stopPropagation();
                    },
                    onChange: (event: Event) => {
                      let target = event.target;
                      if (target instanceof HTMLInputElement) {
                        onToggleSelectAll(target.checked);
                      }
                    }
                  })
                ])
                : null,
              ...props.columns.map((column, columnIndex) => {
              let isResizable = column.resizable || props.resizableColumns.includes(column.key);
              let childColumns = (column as TableColumn & {children?: unknown}).children;
              if (
                Array.isArray(childColumns)
                && childColumns.length > 0
                && isResizable
                && !warnedNestedResizableColumns.has(column.key)
                && process.env.NODE_ENV !== 'production'
              ) {
                console.warn(NESTED_RESIZABLE_COLUMN_WARNING(column.key));
                warnedNestedResizableColumns.add(column.key);
              }
              let isSortable = !!column.sortable;
              let isSortedAsc = props.sortDescriptor?.column === column.key && props.sortDescriptor.direction === 'ascending';
              let isSortedDesc = props.sortDescriptor?.column === column.key && props.sortDescriptor.direction === 'descending';
              let isDividerCell = !!column.showDivider && columnIndex < props.columns.length - 1;
              let columnWidth = toCssSize(column.width);
              let columnMinWidth = toCssSize(column.minWidth);
              let columnMaxWidth = toCssSize(column.maxWidth);

              let headerClassName = classNames(
                styles,
                'spectrum-Table-headCell',
                {
                  'is-resizable': isResizable,
                  'is-sortable': isSortable,
                  'is-sorted-asc': isSortedAsc,
                  'is-sorted-desc': isSortedDesc,
                  'spectrum-Table-cell--divider': isDividerCell,
                  'spectrum-Table-cell--hideHeader': !!column.hideHeader
                }
              );

              let alignToken = alignToSpectrumToken(column.align);
              let alignClassName = column.align
                ? `react-spectrum-Table-cell--align${alignToken}`
                : 'react-spectrum-Table-cell--alignStart';

              let headerContent = isSortable
                ? h('button', {
                  class: [
                    classNames(
                      styles,
                      'spectrum-Table-headCellButton',
                      `spectrum-Table-headCellButton--align${alignToken}`
                    ),
                    'vs-table__sort-button'
                  ],
                  type: 'button',
                  onClick: () => onToggleSort(column)
                }, [
                  h('span', {
                    class: [
                      classNames(styles, 'spectrum-Table-headCellContents', 'spectrum-Table-headerCellText'),
                      'vs-table__head-cell-content'
                    ]
                  }, column.label ?? column.key)
                ])
                : h('span', {
                  class: [
                    classNames(styles, 'spectrum-Table-headCellContents', 'spectrum-Table-headerCellText'),
                    'vs-table__head-cell-content'
                  ]
                }, column.label ?? column.key);

              return h('th', {
                key: column.key,
                role: 'columnheader',
                class: [headerClassName, alignClassName, 'vs-table__head-cell'],
                'aria-colindex': columnIndex + 1 + selectionColumnOffset.value,
                'aria-colspan': column.colspan,
                'aria-level': column.level,
                'aria-posinset': column.posInSet,
                'aria-setsize': column.setSize,
                hidden: !!column.hideHeader,
                'aria-hidden': column.hideHeader ? 'true' : undefined,
                style: {
                  width: columnWidth,
                  minWidth: columnMinWidth,
                  maxWidth: columnMaxWidth
                }
              }, [
                headerContent,
                isResizable
                  ? h('div', {
                    class: [classNames(styles, 'spectrum-Table-columnResizer', {'focus-ring': focusedResizer.value === column.key}), 'vs-table__resizer']
                  }, [
                    h('input', {
                      class: 'vs-table__resizer-input',
                      type: 'range',
                      min: 1,
                      max: 100,
                      value: 50,
                      'aria-label': column.ariaLabel || `${column.label ?? column.key} column resizer`,
                      onFocus: () => {
                        focusedResizer.value = column.key;
                      },
                      onBlur: () => {
                        if (focusedResizer.value === column.key) {
                          focusedResizer.value = null;
                        }
                      }
                    })
                  ])
                  : null,
                isResizable
                  ? h('div', {
                    'aria-hidden': 'true',
                    hidden: true,
                    class: [classNames(styles, 'spectrum-Table-columnResizerPlaceholder'), 'vs-table__resizer-placeholder']
                  })
                  : null
              ]);
            })
            ])
          ]),
          h('tbody', {class: [classNames(styles, 'spectrum-Table-body'), 'vs-table__body'], role: 'rowgroup'}, props.rows.length > 0
            ? [
              ...props.rows.map((row, rowIndex) => {
              let rowId = getRowId(row, rowIndex, props.rowKey);
              let rowChildren = row.children;
              let hasChildren = Array.isArray(rowChildren) && rowChildren.length > 0;

              let isRowDisabled = isRowDisabledByContract(row, rowId);
              let isRowSelected = row.selected ?? selectedSet.value.has(rowId);
              let isRowHovered = hoveredRow.value === rowId && !isRowDisabled;
              let isRowFocused = focusedRow.value === rowId && !isRowDisabled;
              let isRowActive = activeRow.value === rowId && !isRowDisabled;
              let isRowOpen = row.open ?? openSet.value.has(rowId);

              let previousRowId = rowIndex > 0 ? getRowId(props.rows[rowIndex - 1], rowIndex - 1, props.rowKey) : null;
              let nextRowId = rowIndex + 1 < props.rows.length ? getRowId(props.rows[rowIndex + 1], rowIndex + 1, props.rowKey) : null;
              let isPrevSelected = previousRowId != null ? selectedSet.value.has(previousRowId) : false;
              let isNextSelected = nextRowId != null ? selectedSet.value.has(nextRowId) : false;

              let rowClassName = classNames(styles, 'spectrum-Table-row', {
                'focus-ring': isRowFocused,
                'is-active': isRowActive,
                'is-disabled': isRowDisabled,
                'is-focused': isRowFocused,
                'is-hovered': isRowHovered,
                'is-next-selected': isNextSelected,
                'is-open': isRowOpen,
                'is-selected': isRowSelected
              });

              return h('tr', {
                key: String(rowId),
                class: [rowClassName, 'vs-table__row', isPrevSelected ? 'is-prev-selected' : null],
                role: 'row',
                tabindex: isRowDisabled ? -1 : 0,
                'aria-rowindex': rowIndex + 1,
                'aria-selected': props.selectionMode === 'none' ? undefined : toBooleanString(isRowSelected),
                'aria-level': typeof row.level === 'number' ? row.level : 1,
                'aria-posinset': typeof row.posInSet === 'number' ? row.posInSet : rowIndex + 1,
                'aria-setsize': typeof row.setSize === 'number' ? row.setSize : props.rows.length,
                onMouseenter: () => {
                  hoveredRow.value = rowId;
                },
                onMouseleave: () => {
                  if (hoveredRow.value === rowId) {
                    hoveredRow.value = null;
                  }
                  if (activeRow.value === rowId) {
                    activeRow.value = null;
                  }
                },
                onMousedown: () => {
                  if (!isRowDisabled) {
                    activeRow.value = rowId;
                  }
                },
                onMouseup: () => {
                  if (activeRow.value === rowId) {
                    activeRow.value = null;
                  }
                },
                onFocus: () => {
                  focusedRow.value = rowId;
                },
                onBlur: () => {
                  if (focusedRow.value === rowId) {
                    focusedRow.value = null;
                  }
                },
                onDblclick: () => {
                  onToggleOpen(row, rowId);
                },
                onClick: () => {
                  activeRow.value = null;
                  onSelectRow(row, rowId);
                }
              }, [
                hasMultipleSelection.value
                  ? h('td', {
                    key: `${String(rowId)}-selection`,
                    role: 'gridcell',
                    class: [
                      classNames(styles, 'spectrum-Table-cell', 'spectrum-Table-checkboxCell'),
                      'vs-table__cell',
                      'vs-table__cell--selection'
                    ],
                    'aria-colindex': 1
                  }, [
                    h('input', {
                      class: [classNames(styles, 'spectrum-Table-checkbox'), 'vs-table__selection-checkbox'],
                      type: 'checkbox',
                      checked: isRowSelected,
                      disabled: isRowDisabled,
                      'aria-label': `Select row ${rowIndex + 1}`,
                      onClick: (event: Event) => {
                        event.stopPropagation();
                      },
                      onMousedown: (event: Event) => {
                        event.stopPropagation();
                      },
                      onChange: () => {
                        onSelectRow(row, rowId);
                      }
                    })
                  ])
                  : null,
                ...props.columns.map((column, columnIndex) => {
                let cellVisibility = row.visible === false ? 'hidden' : 'visible';
                let alignClassName = column.align
                  ? `react-spectrum-Table-cell--align${column.align[0].toUpperCase()}${column.align.slice(1)}`
                  : 'react-spectrum-Table-cell--alignStart';
                let isCellHidden = row.visible === false;
                let isDividerCell = !!column.showDivider && columnIndex < props.columns.length - 1;
                let cellText = getCellTextValue(row, column.key);
                let cellWidth = toCssSize(column.width);
                let cellMinWidth = toCssSize(column.minWidth);
                let cellMaxWidth = toCssSize(column.maxWidth);

                return h('td', {
                  key: `${String(rowId)}-${column.key}`,
                  role: 'gridcell',
                  class: [
                    classNames(styles, 'spectrum-Table-cell', {
                      'spectrum-Table-cell--divider': isDividerCell,
                      'spectrum-Table-cell--hideHeader': !!column.hideHeader
                    }),
                    alignClassName,
                    'vs-table__cell'
                  ],
                  'aria-colindex': columnIndex + 1 + selectionColumnOffset.value,
                  'aria-colspan': column.colspan,
                  hidden: isCellHidden,
                  'aria-hidden': isCellHidden ? 'true' : undefined,
                  style: {
                    visibility: cellVisibility,
                    width: cellWidth,
                    minWidth: cellMinWidth,
                    maxWidth: cellMaxWidth
                  }
                }, [
                  hasChildren && columnIndex === 0
                    ? h('button', {
                      class: ['vs-table__open-toggle', isRowOpen ? 'is-open' : null],
                      type: 'button',
                      'aria-label': isRowOpen ? 'Collapse row' : 'Expand row',
                      onClick: (event: Event) => {
                        event.stopPropagation();
                        onToggleOpen(row, rowId);
                      }
                    }, isRowOpen ? '▾' : '▸')
                    : null,
                  isLikelyUrl(cellText)
                    ? h('a', {
                      class: ['vs-table__cell-text', 'vs-table__cell-link'],
                      href: cellText,
                      rel: 'noreferrer',
                      target: '_blank'
                    }, cellText)
                    : h('span', {class: 'vs-table__cell-text'}, cellText)
                ]);
              })
              ]);
            }),
              ...(props.loadingState === 'loadingMore'
                ? [h('tr', {
                  class: ['vs-table__row', 'is-loading-more'],
                  role: 'row',
                  key: 'loading-more'
                }, [
                  h('td', {
                    class: ['vs-table__cell', classNames(styles, 'spectrum-Table-cell')],
                    role: 'gridcell',
                    'aria-colspan': Math.max(1, props.columns.length + selectionColumnOffset.value)
                  }, 'Loading more…')
                ])]
                : [])
            ]
            : [
              h('tr', {class: ['vs-table__row', 'is-empty'], role: 'row', key: 'empty'}, [
                h('td', {
                  class: ['vs-table__cell', classNames(styles, 'spectrum-Table-cell')],
                  role: 'gridcell',
                  'aria-colspan': Math.max(1, props.columns.length + selectionColumnOffset.value)
                }, props.loadingState === 'loading' || props.loadingState === 'filtering' ? 'Loading…' : 'No rows')
              ])
            ]),
          h('tbody', {class: 'vs-table__drop-indicators', role: 'rowgroup'}, [
            h('tr', {
              role: 'row',
              hidden: true,
              'aria-hidden': 'true',
              style: {
                visibility: 'hidden'
              }
            }, [
              h('td', {
                role: 'gridcell',
                'aria-colspan': Math.max(1, props.columns.length + selectionColumnOffset.value),
                'aria-selected': 'false'
              }, [
                h('div', {
                  class: [classNames(stylesOverrides, 'react-spectrum-Table-InsertionIndicator'), 'vs-table__insertion-indicator']
                })
              ])
            ])
          ])
        ])
      ]);
    };
  }
});

export const VueTable = Table;
export const TableView = defineComponent({
  name: 'VueTableView',
  inheritAttrs: false,
  setup(_, {attrs, slots}) {
    return () => h(Table, {
      ...attrs
    }, slots);
  }
});
export const TableHeader = StatelyTableHeader;
export const TableBody = StatelyTableBody;
export const Column = StatelyColumn;
export const Row = StatelyRow;
export const Cell = StatelyCell;
export const Section = StatelySection;

export type SpectrumTableProps = InstanceType<typeof Table>['$props'];
export type SpectrumColumnProps<T = unknown> = VueStatelyColumnProps<T>;
export type TableHeaderProps<T = unknown> = VueStatelyTableHeaderProps<T>;
export type TableBodyProps<T = unknown> = VueStatelyTableBodyProps<T>;
export type RowProps<T = unknown> = VueStatelyRowProps<T>;
export type CellProps<T = unknown> = VueStatelyCellProps<T>;
