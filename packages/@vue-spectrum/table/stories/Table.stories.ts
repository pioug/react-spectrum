import {ActionButton} from '@vue-spectrum/button';
import {DialogTrigger} from '@vue-spectrum/dialog';
import {computed, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Table} from '../src';

type StoryArgs = Record<string, unknown>;
type TableColumn = {
  align?: 'center' | 'end' | 'start',
  hideHeader?: boolean,
  key: string,
  label: string,
  maxWidth?: number | string,
  minWidth?: number | string,
  resizable?: boolean,
  showDivider?: boolean,
  sortable?: boolean
  width?: number | string
};
type TableRow = {
  disabled?: boolean,
  id: number | string,
  [key: string]: unknown
};

const BASE_COLUMNS: TableColumn[] = [
  {key: 'name', label: 'Name', sortable: true},
  {key: 'type', label: 'Type'},
  {key: 'date', label: 'Date Modified', align: 'end'}
];

const BASE_ROWS: TableRow[] = [
  {id: 1, name: 'Adobe XD', type: 'Design', date: '2025-10-12'},
  {id: 2, name: 'Daily Standup', type: 'Document', date: '2025-10-15'},
  {id: 3, name: 'Quarterly Plan', type: 'Spreadsheet', date: '2025-10-18'},
  {id: 4, name: 'Design Tokens', type: 'Code', date: '2025-10-22'},
  {id: 5, name: 'Retro Notes', type: 'Document', date: '2025-10-24'}
];

const FALSY_ROW_KEY_ROWS: TableRow[] = [
  {id: 0, name: 'Row id=0', type: 'Edge Case', date: '2025-10-01'},
  {id: 1, name: 'Row id=1', type: 'Normal', date: '2025-10-02'},
  {id: 2, name: 'Row id=2', type: 'Normal', date: '2025-10-03'}
];

const LONG_CONTENT_ROWS: TableRow[] = [
  {
    id: 1,
    name: 'A very long title that should wrap across multiple lines when overflowMode is set to wrap.',
    type: 'Document with long description',
    date: '2025-10-20'
  },
  {
    id: 2,
    name: 'Another long row title that exercises truncation and wrapping behavior in the same table.',
    type: 'Report',
    date: '2025-10-21'
  }
];

const MANY_COLUMNS: TableColumn[] = Array.from({length: 12}, (_, index) => ({
  key: `col${index + 1}`,
  label: `Column ${index + 1}`,
  sortable: index % 2 === 0,
  resizable: true
}));

const MANY_ROWS: TableRow[] = Array.from({length: 80}, (_, rowIndex) => {
  let row: TableRow = {
    id: rowIndex + 1
  };
  for (let columnIndex = 0; columnIndex < MANY_COLUMNS.length; columnIndex++) {
    row[`col${columnIndex + 1}`] = `R${rowIndex + 1}C${columnIndex + 1}`;
  }
  return row;
});

const NESTED_COLUMNS: TableColumn[] = [
  {key: 'name', label: 'Name', sortable: true},
  {key: 'type', label: 'Metadata / Type'},
  {key: 'date', label: 'Metadata / Date Modified', align: 'end'}
];

const RESIZABLE_COLUMNS = BASE_COLUMNS.map((column) => column.key);
export let columns = BASE_COLUMNS;

const meta: Meta<typeof Table> = {
  title: 'TableView',
  component: Table,
  excludeStories: [
    'columns',
    'renderEmptyState',
    'EmptyStateTable'
  ],
  args: {
    ariaLabel: 'Files',
    columns: BASE_COLUMNS,
    rows: BASE_ROWS
  },
  argTypes: {
    ariaLabel: {
      control: 'text'
    },
    ariaLabelledby: {
      control: 'text'
    },
    caption: {
      control: 'text'
    },
    columns: {
      table: {
        disable: true
      }
    },
    dataTestid: {
      control: 'text'
    },
    density: {
      control: 'select',
      options: ['compact', 'regular', 'spacious']
    },
    disabledKeys: {
      table: {
        disable: true
      }
    },
    isDisabled: {
      control: 'boolean'
    },
    isQuiet: {
      control: 'boolean'
    },
    openKeys: {
      table: {
        disable: true
      }
    },
    overflowMode: {
      control: 'select',
      options: ['truncate', 'wrap']
    },
    resizableColumns: {
      table: {
        disable: true
      }
    },
    rowKey: {
      control: 'text'
    },
    rows: {
      table: {
        disable: true
      }
    },
    selectionMode: {
      control: 'text'
    },
    sortDescriptor: {
      table: {
        disable: true
      }
    },
    visibility: {
      control: 'select',
      options: ['hidden', 'visible']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderTable(args: StoryArgs) {
  return {
    components: {Table},
    setup() {
      return {args};
    },
    template: '<Table v-bind="args" />'
  };
}

export function EmptyStateTable(args: StoryArgs) {
  return renderTable(args);
}

function renderFocusableTable(args: StoryArgs) {
  return {
    components: {Table},
    setup() {
      return {args};
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <label for="focus-before">Focus before</label>
        <input id="focus-before" />
        <Table v-bind="args" />
        <label for="focus-after">Focus after</label>
        <input id="focus-after" />
      </div>
    `
  };
}

function renderHorizontalTable(args: StoryArgs, flushBottom = false) {
  return {
    components: {Table},
    setup() {
      return {args, flushBottom};
    },
    template: `
      <div :style="{overflowX: 'auto', paddingBottom: flushBottom ? '0px' : '24px'}">
        <div style="width: 1200px;">
          <Table v-bind="args" />
        </div>
      </div>
    `
  };
}

function renderAsyncTable(args: StoryArgs, label: string, loadMoreEnabled = false, wrap = false) {
  return {
    components: {ActionButton, Table},
    setup() {
      let allRows = [...BASE_ROWS, ...MANY_ROWS.slice(0, 10)];
      let rows = ref<TableRow[]>([]);
      let query = ref('');
      let loading = ref(false);

      let visibleRows = computed(() => {
        if (!query.value) {
          return rows.value;
        }
        let needle = query.value.toLowerCase();
        return rows.value.filter((row) => String(row.name ?? '').toLowerCase().includes(needle));
      });

      let loadRows = (append = false) => {
        loading.value = true;
        setTimeout(() => {
          if (append) {
            rows.value = [...rows.value, ...allRows.slice(rows.value.length, rows.value.length + 5)];
          } else {
            rows.value = allRows.slice(0, 8);
          }
          loading.value = false;
        }, 250);
      };

      loadRows(false);

      return {
        args,
        label,
        loadMoreEnabled,
        loadRows,
        loading,
        query,
        visibleRows,
        wrap
      };
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <div>{{label}}</div>
        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <input v-model="query" type="text" placeholder="Filter by name" />
          <ActionButton @click="loadRows(false)">Reload</ActionButton>
          <ActionButton v-if="loadMoreEnabled" @click="loadRows(true)">Load more</ActionButton>
        </div>
        <div v-if="loading">Loading…</div>
        <Table v-bind="args" :rows="visibleRows" :overflow-mode="wrap ? 'wrap' : args.overflowMode" />
      </div>
    `
  };
}

export const Static: Story = {
  name: 'static',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS
  }
};

export const Dynamic: Story = {
  name: 'dynamic',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS,
    rows: [...BASE_ROWS]
  }
};

export const DynamicFalsyRowKeys: Story = {
  name: 'dynamic, falsy row keys',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS,
    rows: FALSY_ROW_KEY_ROWS
  }
};

export const HorizontalScrollingOnly: Story = {
  name: 'horizontal scrolling only',
  render: (args) => renderHorizontalTable(args),
  args: {
    columns: MANY_COLUMNS,
    rows: MANY_ROWS.slice(0, 10)
  }
};

export const HorizontalScrollingOnlyFlushBottom: Story = {
  name: 'horizontal scrolling only flush bottom',
  render: (args) => renderHorizontalTable(args, true),
  args: {
    columns: MANY_COLUMNS,
    rows: MANY_ROWS.slice(0, 10)
  }
};

export const DynamicWithDisabledKeys: Story = {
  name: 'dynamic with disabled keys',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS,
    disabledKeys: new Set([1, 3])
  }
};

export const DynamicShowDividers: Story = {
  name: 'dynamic showDividers',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS.map((column, index) => ({...column, showDivider: index < BASE_COLUMNS.length - 1})),
    rows: BASE_ROWS
  }
};

export const DynamicSelectedKeys: Story = {
  name: 'selectedKeys',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS,
    selectionMode: 'multiple',
    modelValue: new Set([1, 3])
  },
  parameters: {
    controls: {
      exclude: /selectionMode/
    }
  }
};

export const StaticNestedColumns: Story = {
  name: 'static with nested columns',
  render: (args) => renderTable(args),
  args: {
    columns: NESTED_COLUMNS,
    rows: BASE_ROWS
  }
};

export const DynamicNestedColumns: Story = {
  name: 'dynamic with nested columns',
  render: (args) => renderTable(args),
  args: {
    columns: NESTED_COLUMNS,
    rows: [...BASE_ROWS]
  }
};

export const DynamicNestedColumnsWithResizing: Story = {
  name: 'dynamic with nested columns with resizing',
  render: (args) => renderTable(args),
  args: {
    columns: NESTED_COLUMNS,
    rows: BASE_ROWS,
    resizableColumns: NESTED_COLUMNS.map((column) => column.key)
  }
};

export const TableColSpanExample: Story = {
  render: (args) => renderTable(args),
  args: {
    columns: [
      {key: 'name', label: 'Name', colspan: 2},
      {key: 'date', label: 'Date Modified'}
    ],
    rows: BASE_ROWS
  }
};

export const TableCellColSpanWithVariousSpansExample: Story = {
  render: (args) => renderTable(args),
  args: {
    columns: [
      {key: 'name', label: 'Name', colspan: 1},
      {key: 'type', label: 'Type', colspan: 2},
      {key: 'date', label: 'Date Modified'}
    ],
    rows: BASE_ROWS
  }
};

export const FocusableCells: Story = {
  name: 'focusable cells',
  render: (args) => renderFocusableTable(args),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS
  }
};

export const ManyColumnsAndRows: Story = {
  name: 'many columns and rows',
  render: (args) => renderTable(args),
  args: {
    columns: MANY_COLUMNS,
    rows: MANY_ROWS
  }
};

export const ShouldFillCellWidth: Story = {
  name: 'should fill cell width',
  render: (args) => ({
    components: {Table},
    setup() {
      return {args};
    },
    template: `
      <div style="width: min(100%, 900px);">
        <Table v-bind="args" />
      </div>
    `
  }),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS
  }
};

export const ColumnWidthsAndDividers: Story = {
  name: 'column widths and dividers',
  render: (args) => renderTable(args),
  args: {
    columns: [
      {key: 'name', label: 'Name', width: 250, showDivider: true},
      {key: 'type', label: 'Type'},
      {key: 'date', label: 'Date Modified', align: 'end'}
    ],
    rows: BASE_ROWS
  }
};

export const CellWithLongContent: Story = {
  name: 'cell with long content',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS,
    rows: LONG_CONTENT_ROWS,
    overflowMode: 'wrap'
  },
  parameters: {
    description: {
      data: 'After changing overflowMode, refresh page to see the change.'
    }
  }
};

export const CustomRowHeaderLabeling: Story = {
  name: 'custom isRowHeader labeling',
  render: (args) => ({
    components: {Table},
    setup() {
      return {args};
    },
    template: `
      <div>
        <h3 id="table-heading">Assets</h3>
        <Table v-bind="args" aria-labelledby="table-heading" />
      </div>
    `
  }),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS
  },
  parameters: {
    description: {
      content: 'Changes how the screen reader labels rows.'
    }
  }
};

export const CRUD: Story = {
  render: (args) => ({
    components: {ActionButton, Table},
    setup() {
      let rows = ref<TableRow[]>([...BASE_ROWS]);
      let nextId = ref(100);
      let addRow = () => {
        rows.value.push({
          id: nextId.value++,
          name: `New row ${nextId.value}`,
          type: 'Generated',
          date: '2025-11-01'
        });
      };
      let removeLast = () => {
        rows.value = rows.value.slice(0, -1);
      };
      return {
        addRow,
        args,
        removeLast,
        rows
      };
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <div style="display: flex; gap: 8px;">
          <ActionButton @click="addRow">Add row</ActionButton>
          <ActionButton @click="removeLast">Remove last row</ActionButton>
        </div>
        <Table v-bind="args" :rows="rows" />
      </div>
    `
  }),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS
  }
};

export const InlineDeleteButtons: Story = {
  name: 'Inline delete buttons',
  render: (args) => ({
    components: {ActionButton, Table},
    setup() {
      let rows = ref<TableRow[]>([...BASE_ROWS]);
      let removeById = (id: number | string) => {
        rows.value = rows.value.filter((row) => row.id !== id);
      };
      return {
        args,
        removeById,
        rows
      };
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <ActionButton v-for="row in rows" :key="row.id" @click="removeById(row.id)">
            Delete {{row.name}}
          </ActionButton>
        </div>
        <Table v-bind="args" :rows="rows" />
      </div>
    `
  }),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS
  }
};

export const HidingColumnsExample: Story = {
  name: 'hiding columns',
  render: (args) => ({
    components: {ActionButton, Table},
    setup() {
      let showDateColumn = ref(true);
      let columns = computed(() => showDateColumn.value ? BASE_COLUMNS : BASE_COLUMNS.slice(0, 2));
      return {
        args,
        columns,
        showDateColumn
      };
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <ActionButton @click="showDateColumn = !showDateColumn">
          {{showDateColumn ? 'Hide' : 'Show'}} date column
        </ActionButton>
        <Table v-bind="args" :columns="columns" />
      </div>
    `
  }),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS
  }
};

export const IsLoading: Story = {
  name: 'isLoading',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS,
    rows: [],
    loadingState: 'loading'
  }
};

export const IsLoadingMore: Story = {
  name: 'isLoading more',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS.slice(0, 2),
    loadingState: 'loadingMore'
  }
};

export const Filtering: Story = {
  name: 'filtering',
  render: (args) => ({
    components: {Table},
    setup() {
      let query = ref('');
      let filteredRows = computed(() => {
        let needle = query.value.toLowerCase();
        if (!needle) {
          return BASE_ROWS;
        }
        return BASE_ROWS.filter((row) => String(row.name).toLowerCase().includes(needle));
      });
      return {
        args,
        filteredRows,
        query
      };
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <input v-model="query" type="text" placeholder="Filter rows" />
        <Table v-bind="args" :rows="filteredRows" />
      </div>
    `
  }),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS
  }
};

export const EmptyStateStory: Story = {
  name: 'renderEmptyState',
  render: (args) => EmptyStateTable(args),
  args: {
    columns: BASE_COLUMNS,
    rows: []
  }
};

export const AsyncLoading: Story = {
  name: 'async loading',
  render: (args) => renderAsyncTable(args, 'Async loading'),
  args: {
    columns: BASE_COLUMNS,
    rows: []
  }
};

export const AsyncLoadingQuarryTest: Story = {
  name: 'async reload on sort',
  render: (args) => renderAsyncTable(args, 'Async loading quarry test'),
  args: {
    columns: BASE_COLUMNS,
    rows: []
  }
};

export const HideHeader: Story = {
  name: 'hideHeader',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS,
    visibility: 'hidden'
  }
};

export const AsyncLoadingClientFiltering: Story = {
  name: 'async client side filter loading',
  render: (args) => renderAsyncTable(args, 'Async loading with client filtering'),
  args: {
    columns: BASE_COLUMNS,
    rows: []
  }
};

export const AsyncLoadingServerFiltering: Story = {
  name: 'async server side filter loading',
  render: (args) => renderAsyncTable(args, 'Async loading with server filtering'),
  args: {
    columns: BASE_COLUMNS,
    rows: []
  }
};

export const AsyncLoadingServerFilteringLoadMore: Story = {
  name: 'loads more on scroll when contentSize.height < rect.height * 2',
  render: (args) => renderAsyncTable(args, 'Async loading server filtering + load more', true),
  args: {
    columns: BASE_COLUMNS,
    rows: []
  }
};

export const WithDialogTrigger: Story = {
  name: 'with dialog trigger',
  render: (args) => ({
    components: {DialogTrigger, Table},
    setup() {
      return {args};
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <Table v-bind="args" />
        <DialogTrigger type="modal" title="Row details">
          <p>Dialog trigger.</p>
        </DialogTrigger>
      </div>
    `
  }),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS
  }
};

export const WithBreadcrumbNavigation: Story = {
  name: 'table with breadcrumb navigation',
  render: (args) => ({
    components: {Table},
    setup() {
      return {args};
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <nav aria-label="breadcrumb">Home / Projects / Files</nav>
        <Table v-bind="args" />
      </div>
    `
  }),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS
  }
};

export const ResizingUncontrolledDynamicWidths: Story = {
  name: 'allowsResizing, uncontrolled, dynamic widths',
  render: (args) => renderTable(args),
  args: {
    columns: MANY_COLUMNS.slice(0, 8),
    rows: MANY_ROWS.slice(0, 12),
    resizableColumns: MANY_COLUMNS.slice(0, 8).map((column) => column.key)
  }
};

export const ResizingUncontrolledStaticWidths: Story = {
  name: 'allowsResizing, uncontrolled, static widths',
  render: (args) => renderTable(args),
  args: {
    columns: [
      {key: 'name', label: 'Name', width: 240},
      {key: 'type', label: 'Type', width: 160},
      {key: 'date', label: 'Date Modified', align: 'end', width: 200}
    ],
    rows: BASE_ROWS,
    resizableColumns: RESIZABLE_COLUMNS
  }
};

export const ResizingUncontrolledColumnDivider: Story = {
  name: 'allowsResizing, uncontrolled, column divider',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS.map((column, index) => ({...column, showDivider: index < BASE_COLUMNS.length - 1})),
    rows: BASE_ROWS,
    resizableColumns: RESIZABLE_COLUMNS
  }
};

export const ResizingUncontrolledMinMax: Story = {
  name: 'allowsResizing, uncontrolled, min/max widths',
  render: (args) => renderTable(args),
  args: {
    columns: [
      {key: 'name', label: 'Name', minWidth: 180, maxWidth: 360},
      {key: 'type', label: 'Type', minWidth: 120, maxWidth: 220},
      {key: 'date', label: 'Date Modified', align: 'end', minWidth: 160, maxWidth: 280}
    ],
    rows: BASE_ROWS,
    resizableColumns: RESIZABLE_COLUMNS
  }
};

export const ResizingUncontrolledSomeNotAllowed: Story = {
  name: 'allowsResizing, uncontrolled, some columns not allowed resizing',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS,
    resizableColumns: ['name']
  }
};

export const ResizingUncontrolledNoHeightWidth: Story = {
  name: 'allowsResizing, uncontrolled, undefined table width and height',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS,
    resizableColumns: RESIZABLE_COLUMNS
  }
};

export const ResizingUncontrolledSortableColumns: Story = {
  name: 'allowsResizing, uncontrolled, sortable columns',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS.map((column) => ({...column, sortable: true})),
    rows: BASE_ROWS,
    resizableColumns: RESIZABLE_COLUMNS,
    sortDescriptor: {
      column: 'name',
      direction: 'ascending'
    }
  }
};

export const ResizingManyColumnsRows: Story = {
  name: 'allowsResizing, many columns and rows',
  render: (args) => renderTable(args),
  args: {
    columns: MANY_COLUMNS,
    rows: MANY_ROWS,
    resizableColumns: MANY_COLUMNS.map((column) => column.key)
  }
};

export const ResizingHidingColumns: Story = {
  name: 'allowsResizing, hiding columns',
  render: (args) => ({
    components: {ActionButton, Table},
    setup() {
      let showAll = ref(true);
      let columns = computed(() => showAll.value ? MANY_COLUMNS.slice(0, 8) : MANY_COLUMNS.slice(0, 4));
      return {
        args,
        columns,
        showAll
      };
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <ActionButton @click="showAll = !showAll">
          {{showAll ? 'Show fewer columns' : 'Show all columns'}}
        </ActionButton>
        <Table v-bind="args" :columns="columns" />
      </div>
    `
  }),
  args: {
    columns: MANY_COLUMNS.slice(0, 8),
    rows: MANY_ROWS.slice(0, 12),
    resizableColumns: MANY_COLUMNS.slice(0, 8).map((column) => column.key)
  }
};

export const ResizingZoom: Story = {
  name: 'zoom resizing table',
  render: (args) => ({
    components: {Table},
    setup() {
      return {args};
    },
    template: `
      <div style="zoom: 1.25;">
        <Table v-bind="args" />
      </div>
    `
  }),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS,
    resizableColumns: RESIZABLE_COLUMNS
  },
  parameters: {
    description: {
      data: 'Using browser zoom should not trigger an infinite resizing loop. CMD+"+" to zoom in and CMD+"-" to zoom out.'
    }
  }
};

export const ResizingControlledNoInitialWidths: Story = {
  name: 'allowsResizing, controlled, no widths',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS,
    resizableColumns: RESIZABLE_COLUMNS
  },
  parameters: {
    description: {
      data: `
    You can use the buttons to save and restore the column widths. When restoring,
    you will notice that the entire table reverts, this is because no columns are controlled.
  `
    }
  }
};

export const ResizingControlledSomeInitialWidths: Story = {
  name: 'allowsResizing, controlled, some widths',
  render: (args) => renderTable(args),
  args: {
    columns: [
      {key: 'name', label: 'Name', width: 220},
      {key: 'type', label: 'Type'},
      {key: 'date', label: 'Date Modified', align: 'end', width: 180}
    ],
    rows: BASE_ROWS,
    resizableColumns: RESIZABLE_COLUMNS
  },
  parameters: {
    description: {
      data: `
    You can use the buttons to save and restore the column widths. When restoring,
    you will see a quick flash because the entire table is re-rendered. This
    mimics what would happen if an app reloaded the whole page and restored a saved
    column width state. This is a "some widths" controlled story. It cannot restore
    the widths of the columns that it does not manage. Height and weight are uncontrolled.
  `
    }
  }
};

export const ResizingControlledAllInitialWidths: Story = {
  name: 'allowsResizing, controlled, all widths',
  render: (args) => renderTable(args),
  args: {
    columns: [
      {key: 'name', label: 'Name', width: 220},
      {key: 'type', label: 'Type', width: 180},
      {key: 'date', label: 'Date Modified', align: 'end', width: 200}
    ],
    rows: BASE_ROWS,
    resizableColumns: RESIZABLE_COLUMNS
  },
  parameters: {
    description: {
      data: `
    You can use the buttons to save and restore the column widths. When restoring,
    you will see a quick flash because the entire table is re-rendered. This
    mimics what would happen if an app reloaded the whole page and restored a saved
    column width state.
  `
    }
  }
};

export const ResizingControlledHideHeader: Story = {
  name: 'allowsResizing, controlled, hideHeader',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS,
    resizableColumns: RESIZABLE_COLUMNS,
    visibility: 'hidden'
  },
  parameters: {
    description: {
      data: `
    Hide headers columns should not be resizable.
  `
    }
  }
};

export const TypeaheadWithDialog: Story = {
  render: (args) => ({
    components: {DialogTrigger, Table},
    setup() {
      let query = ref('');
      let filteredRows = computed(() => {
        let needle = query.value.toLowerCase();
        return BASE_ROWS.filter((row) => String(row.name).toLowerCase().includes(needle));
      });
      return {
        args,
        filteredRows,
        query
      };
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <input v-model="query" type="text" placeholder="Typeahead query" />
        <Table v-bind="args" :rows="filteredRows" />
        <DialogTrigger title="Typeahead details">
          <p>Typeahead with dialog.</p>
        </DialogTrigger>
      </div>
    `
  }),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS
  }
};

export const Links: Story = {
  render: (args) => renderTable(args),
  args: {
    columns: [
      {key: 'name', label: 'Name'},
      {key: 'link', label: 'Link'},
      {key: 'date', label: 'Date Modified'}
    ],
    rows: [
      {id: 1, name: 'Design System', link: 'https://react-spectrum.adobe.com', date: '2025-10-20'},
      {id: 2, name: 'OpenAI', link: 'https://openai.com', date: '2025-10-21'},
      {id: 3, name: 'Adobe', link: 'https://adobe.com', date: '2025-10-22'}
    ]
  }
};

export const ColumnHeaderFocusRingTable: Story = {
  name: 'column header focus after loading',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS.map((column) => ({...column, sortable: true})),
    rows: BASE_ROWS
  },
  parameters: {
    description: {
      data: 'Column header should remain focused even if the table collections empties/loading state changes to loading'
    }
  }
};

export const AsyncLoadOverflowWrapReproStory: Story = {
  name: 'async, overflow wrap scroll jumping reproduction',
  render: (args) => renderAsyncTable(args, 'Async load overflow wrap repro', false, true),
  args: {
    columns: BASE_COLUMNS,
    rows: [],
    overflowMode: 'wrap'
  },
  parameters: {
    description: {
      data: `
    Rapidly scrolling down through this table should not cause the scroll position to jump to the top.
  `
    }
  }
};

export const Performance: Story = {
  render: (args) => renderTable(args),
  args: {
    columns: MANY_COLUMNS,
    rows: MANY_ROWS
  }
};
