import '@adobe/spectrum-css-temp/components/table/vars.css';
import './table.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref} from 'vue';
const styles: {[key: string]: string} = {};


const stylesOverrides: {[key: string]: string} = {};

type SelectionMode = 'multiple' | 'none' | 'single';
type SortDirection = 'ascending' | 'descending';
type SelectionValue = number | string | Array<number | string>;

type TableColumn = {
  align?: 'center' | 'end' | 'start',
  ariaLabel?: string,
  colspan?: number,
  key: string,
  label?: string,
  level?: number,
  posInSet?: number,
  resizable?: boolean,
  setSize?: number,
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

let tableId = 0;

function normalizeSelectedValue(value: SelectionValue | undefined): Array<number | string> {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is number | string => typeof entry === 'number' || typeof entry === 'string');
  }

  if (typeof value === 'number' || typeof value === 'string') {
    return [value];
  }

  return [];
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
    isDisabled: {
      type: Boolean,
      default: false
    },
    isQuiet: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: [String, Number, Array] as PropType<SelectionValue | undefined>,
      default: undefined
    },
    openKeys: {
      type: Array as PropType<Array<number | string>>,
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
    openChange: (keys: Array<number | string>) => Array.isArray(keys),
    rowAction: (row: TableRow) => typeof row === 'object' && row !== null,
    sortChange: (value: SortDescriptor) => typeof value === 'object' && value !== null,
    'update:modelValue': (value: SelectionValue) => {
      if (typeof value === 'number' || typeof value === 'string') {
        return true;
      }

      return Array.isArray(value);
    }
  },
  setup(props, {emit, attrs}) {
    let generatedId = `vs-table-${++tableId}`;
    let tableLabelId = computed(() => props.ariaLabelledby || (props.caption ? `${generatedId}-caption` : undefined));

    let hoveredRow = ref<number | string | null>(null);
    let focusedRow = ref<number | string | null>(null);
    let activeRow = ref<number | string | null>(null);
    let focusedResizer = ref<string | null>(null);

    let selectedSet = computed(() => new Set(normalizeSelectedValue(props.modelValue)));
    let openSet = computed(() => new Set(props.openKeys));
    let hasMultipleSelection = computed(() => props.selectionMode === 'multiple');
    let selectionColumnOffset = computed(() => hasMultipleSelection.value ? 1 : 0);
    let selectableRowIds = computed(() => props.rows.reduce<Array<number | string>>((acc, row, rowIndex) => {
      if (props.isDisabled || row.disabled) {
        return acc;
      }

      acc.push(getRowId(row, rowIndex, props.rowKey));
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

    let onSelectRow = (row: TableRow, rowId: number | string) => {
      if (props.isDisabled || row.disabled || props.selectionMode === 'none') {
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

      emit('update:modelValue', Array.from(next));
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

      emit('openChange', Array.from(next));
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
        emit('update:modelValue', []);
        return;
      }

      emit('update:modelValue', selectableRowIds.value.slice());
    };

    return () => {
      let rootClassName = classNames(
        styles,
        'spectrum-Table',
        `spectrum-Table--${props.density}`,
        {
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
              let isSortable = !!column.sortable;
              let isSortedAsc = props.sortDescriptor?.column === column.key && props.sortDescriptor.direction === 'ascending';
              let isSortedDesc = props.sortDescriptor?.column === column.key && props.sortDescriptor.direction === 'descending';

              let headerClassName = classNames(
                styles,
                'spectrum-Table-headCell',
                {
                  'is-resizable': isResizable,
                  'is-sortable': isSortable,
                  'is-sorted-asc': isSortedAsc,
                  'is-sorted-desc': isSortedDesc
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
                'aria-setsize': column.setSize
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
            ? props.rows.map((row, rowIndex) => {
              let rowId = getRowId(row, rowIndex, props.rowKey);
              let rowChildren = row.children;
              let hasChildren = Array.isArray(rowChildren) && rowChildren.length > 0;

              let isRowDisabled = props.isDisabled || !!row.disabled;
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

                return h('td', {
                  key: `${String(rowId)}-${column.key}`,
                  role: 'gridcell',
                  class: [classNames(styles, 'spectrum-Table-cell'), alignClassName, 'vs-table__cell'],
                  'aria-colindex': columnIndex + 1 + selectionColumnOffset.value,
                  'aria-colspan': column.colspan,
                  hidden: isCellHidden,
                  'aria-hidden': isCellHidden ? 'true' : undefined,
                  style: {
                    visibility: cellVisibility
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
                  h('span', {class: 'vs-table__cell-text'}, getCellTextValue(row, column.key))
                ]);
              })
              ]);
            })
            : [
              h('tr', {class: ['vs-table__row', 'is-empty'], role: 'row', key: 'empty'}, [
                h('td', {
                  class: ['vs-table__cell', classNames(styles, 'spectrum-Table-cell')],
                  role: 'gridcell',
                  'aria-colspan': Math.max(1, props.columns.length + selectionColumnOffset.value)
                }, 'No rows')
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
export const TableView = Table;
export const TableHeader = Table;
export const TableBody = Table;
export const Column = Table;
export const Row = Table;
export const Cell = Table;
export const Section = Table;

export type SpectrumTableProps = InstanceType<typeof Table>['$props'];
export type SpectrumColumnProps = SpectrumTableProps;
export type TableHeaderProps<T = unknown> = SpectrumTableProps & {item?: T};
export type TableBodyProps<T = unknown> = SpectrumTableProps & {item?: T};
export type RowProps<T = unknown> = SpectrumTableProps & {item?: T};
export type CellProps<T = unknown> = SpectrumTableProps & {item?: T};
