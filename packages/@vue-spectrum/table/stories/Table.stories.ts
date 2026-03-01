import {ActionButton, Button} from '@vue-spectrum/button';
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
  {key: 'foo', label: 'Foo'},
  {key: 'bar', label: 'Bar'},
  {key: 'baz', label: 'Baz'}
];

const BASE_ROWS: TableRow[] = [
  {test: 'Test 1', foo: 'Foo 1', bar: 'Bar 1', yay: 'Yay 1', baz: 'Baz 1', id: 1},
  {test: 'Test 2', foo: 'Foo 2', bar: 'Bar 2', yay: 'Yay 2', baz: 'Baz 2', id: 2},
  {test: 'Test 1', foo: 'Foo 3', bar: 'Bar 1', yay: 'Yay 1', baz: 'Baz 1', id: 3},
  {test: 'Test 2', foo: 'Foo 4', bar: 'Bar 2', yay: 'Yay 2', baz: 'Baz 2', id: 4},
  {test: 'Test 1', foo: 'Foo 5', bar: 'Bar 1', yay: 'Yay 1', baz: 'Baz 1', id: 5},
  {test: 'Test 2', foo: 'Foo 6', bar: 'Bar 2', yay: 'Yay 2', baz: 'Baz 2', id: 6},
  {test: 'Test 1', foo: 'Foo 7', bar: 'Bar 1', yay: 'Yay 1', baz: 'Baz 1', id: 7},
  {test: 'Test 2', foo: 'Foo 8', bar: 'Bar 2', yay: 'Yay 2', baz: 'Baz 2', id: 8}
];

const STATIC_ROWS: TableRow[] = [
  {id: 's1', foo: 'One', bar: 'Two', baz: 'Three'},
  {id: 's2', foo: 'One', bar: 'Two', baz: 'Three'}
];

const FALSY_ROW_KEY_ROWS: TableRow[] = [
  {id: 0, foo: 'Foo 1', bar: 'Bar 1', yay: 'Yay 1', baz: 'Baz 1'},
  {id: 1, foo: 'Foo 2', bar: 'Bar 1', yay: 'Yay 1', baz: 'Baz 1'}
];

const LONG_CONTENT_ROWS: TableRow[] = [
  {
    id: 'l1',
    foo: 'A very long title that should wrap across multiple lines when overflowMode is set to wrap.',
    bar: 'PDF',
    baz: '214 KB'
  },
  {
    id: 'l2',
    foo: 'Another long row title that exercises truncation and wrapping behavior in the same table.',
    bar: 'XLS',
    baz: '120 KB'
  }
];

const MANY_COLUMNS: TableColumn[] = Array.from({length: 100}, (_, index) => ({
  key: `C${index}`,
  label: `Column ${index}`,
  minWidth: 100,
  resizable: true
}));

const MANY_ROWS: TableRow[] = Array.from({length: 1000}, (_, rowIndex) => {
  let row: TableRow = {
    id: `R${rowIndex}`
  };
  for (let columnIndex = 0; columnIndex < MANY_COLUMNS.length; columnIndex++) {
    row[`C${columnIndex}`] = `${rowIndex}, ${columnIndex}`;
  }
  return row;
});

const NESTED_COLUMNS: TableColumn[] = [
  {key: 'test', label: 'Test'},
  {key: 'foo', label: 'Foo'},
  {key: 'bar', label: 'Bar'},
  {key: 'yay', label: 'Yay'},
  {key: 'baz', label: 'Baz'}
];

const POKEMON_ROWS: TableRow[] = [
  {id: 1, name: 'Charizard', type: 'Fire, Flying', level: '67', weight: '200lbs', height: '5\'7"'},
  {id: 2, name: 'Blastoise', type: 'Water', level: '56', weight: '188lbs', height: '5\'3"'},
  {id: 3, name: 'Venusaur', type: 'Grass, Poison', level: '83', weight: '220lbs', height: '6\'7"'},
  {id: 4, name: 'Pikachu', type: 'Electric', level: '100', weight: '13lbs', height: '1\'4"'},
  {id: 5, name: 'Charizard', type: 'Fire, Flying', level: '67', weight: '200lbs', height: '5\'7"'},
  {id: 6, name: 'Blastoise', type: 'Water', level: '56', weight: '188lbs', height: '5\'3"'},
  {id: 7, name: 'Venusaur', type: 'Grass, Poison', level: '83', weight: '220lbs', height: '6\'7"'},
  {id: 8, name: 'Pikachu', type: 'Electric', level: '100', weight: '13lbs', height: '1\'4"'},
  {id: 9, name: 'Charizard', type: 'Fire, Flying', level: '67', weight: '200lbs', height: '5\'7"'},
  {id: 10, name: 'Blastoise', type: 'Water', level: '56', weight: '188lbs', height: '5\'3"'},
  {id: 11, name: 'Venusaur', type: 'Grass, Poison', level: '83', weight: '220lbs', height: '6\'7"'},
  {id: 12, name: 'Pikachu', type: 'Electric', level: '100', weight: '13lbs', height: '1\'4"'}
];

const PLAN_ROWS: TableRow[] = [
  {id: 1, planName: 'Plan 1: $300k, digital', audienceType: 'Strategic', netBudget: '$300,000', targetOtp: '7.4%', reach: '11.52%'},
  {id: 2, planName: 'Plan 2: $500k, digital', audienceType: 'Strategic', netBudget: '$500,000', targetOtp: '22.5%', reach: '11.5%'},
  {id: 3, planName: 'Plan 3: $800k, digital', audienceType: 'Strategic', netBudget: '$800,000', targetOtp: '22.5%', reach: '11.5%'},
  {id: 4, planName: 'Plan 4: $300k, MRI', audienceType: 'Demo+strategic', netBudget: '$300,000', targetOtp: '22.5%', reach: '11.5%'},
  {id: 5, planName: 'Plan 5: $500k, MRI', audienceType: 'Demo+strategic', netBudget: '$500,000', targetOtp: '22.5%', reach: '11.5%'},
  {id: 6, planName: 'Plan 6: $800k, MRI', audienceType: 'Demo+strategic', netBudget: '$800,000', targetOtp: '22.5%', reach: '11.5%'}
];

const ASYNC_NEWS_COLUMNS: TableColumn[] = [
  {key: 'score', label: 'Score', sortable: true},
  {key: 'title', label: 'Title', sortable: true},
  {key: 'author', label: 'Author', sortable: true},
  {key: 'num_comments', label: 'Comments', sortable: true}
];

const QUARRY_COLUMNS: TableColumn[] = [
  {key: 'title', label: 'Title', sortable: true},
  {key: 'ups', label: 'Upvotes', sortable: true},
  {key: 'created', label: 'Created', sortable: true}
];

const QUARRY_ROWS: TableRow[] = Array.from({length: 10}, (_, index) => ({
  id: `q${index}`,
  title: 'cats',
  ups: '7',
  created: '+058133-09-04T03:49:44.000Z'
}));

const STAR_WARS_COLUMNS: TableColumn[] = [
  {key: 'name', label: 'Name'},
  {key: 'height', label: 'Height', align: 'end'},
  {key: 'mass', label: 'Mass', align: 'end'},
  {key: 'birth_year', label: 'Birth Year', align: 'end'}
];

const PROJECT_COLUMNS: TableColumn[] = [
  {key: 'name', label: 'Name'},
  {key: 'ownerName', label: 'Owner'}
];

const PROJECT_ROWS: TableRow[] = [
  {id: 'xx', name: 'abc', ownerName: 'xx'},
  {id: 'aa', name: 'efg', ownerName: 'aa'},
  {id: 'yy', name: 'abcd', ownerName: 'yy'},
  {id: 'bb', name: 'efgh', ownerName: 'bb'},
  {id: 'zz', name: 'abce', ownerName: 'zz'},
  {id: 'cc', name: 'efgi', ownerName: 'cc'}
];

const STAR_WARS_ROWS: TableRow[] = [
  {id: 'sw1', name: 'Luke Skywalker', height: '172', mass: '77', birth_year: '19BBY'},
  {id: 'sw2', name: 'C-3PO', height: '167', mass: '75', birth_year: '112BBY'},
  {id: 'sw3', name: 'R2-D2', height: '96', mass: '32', birth_year: '33BBY'},
  {id: 'sw4', name: 'Darth Vader', height: '202', mass: '136', birth_year: '41.9BBY'},
  {id: 'sw5', name: 'Leia Organa', height: '150', mass: '49', birth_year: '19BBY'},
  {id: 'sw6', name: 'Owen Lars', height: '178', mass: '120', birth_year: '52BBY'},
  {id: 'sw7', name: 'Beru Whitesun lars', height: '165', mass: '75', birth_year: '47BBY'},
  {id: 'sw8', name: 'R5-D4', height: '97', mass: '32', birth_year: 'unknown'}
];

const STAR_WARS_WRAP_ROWS: TableRow[] = [
  {id: 'wrap-1', name: 'Luke Sky... Sky... Sky...', height: '172+... 172+... 172+...', mass: '77+... 77+... 77+...', birth_year: '19BB...'},
  {id: 'wrap-2', name: 'C-3PO... 3PO... 3PO...', height: '167+... 167+... 167+...', mass: '75+... 75+... 75+...', birth_year: '112B...'},
  {id: 'wrap-3', name: 'R2-D2... D2... D2...', height: '96+... 96+... 96+...', mass: '32+... 32+... 32+...', birth_year: '33BB...'}
];

const PERFORMANCE_COLUMNS: TableColumn[] = [
  {key: 'airline', label: 'Airline'},
  {key: 'destinations', label: 'Desti...'},
  {key: 'scheduledAt', label: 'Sche...'},
  {key: 'status', label: 'Status'},
  {key: 'rating', label: 'Rating'},
  {key: 'progress', label: 'Prog...'},
  {key: 'url', label: 'URL'},
  {key: 'overbooked', label: 'Over...'},
  {key: 'action', label: 'Take ...'},
  {key: 'rating2', label: 'Rating'}
];

const PERFORMANCE_ROWS: TableRow[] = [
  {id: 'perf-1', airline: 'Kore...', destinations: 'I..', scheduledAt: '1/25/...', status: '🟠', rating: '★ ...', progress: '━━━━', url: 'https...', overbooked: '☑', action: 'View', rating2: '★ ...'},
  {id: 'perf-2', airline: 'Hain...', destinations: 'C..', scheduledAt: '9/24/...', status: '🟢', rating: '★ ...', progress: '━━━', url: 'https...', overbooked: '☐', action: 'View', rating2: '★ ...'},
  {id: 'perf-3', airline: 'SunE...', destinations: 'V..', scheduledAt: '5/20/...', status: '🟠', rating: '★ ...', progress: '━━━━', url: 'https...', overbooked: '☐', action: 'View', rating2: '★ ...'},
  {id: 'perf-4', airline: 'Wingo', destinations: 'O..', scheduledAt: '6/2/...', status: '🟠', rating: '★ ...', progress: '━━━━', url: 'https...', overbooked: '☑', action: 'View', rating2: '★ ...'},
  {id: 'perf-5', airline: 'Easyfly', destinations: 'C..', scheduledAt: '12/18...', status: '🔴', rating: '★ ...', progress: '━━━', url: 'https...', overbooked: '☐', action: 'View', rating2: '★ ...'},
  {id: 'perf-6', airline: 'Wingo', destinations: 'M..', scheduledAt: '9/28/...', status: '🟠', rating: '★ ...', progress: '━━━━', url: 'https...', overbooked: '☑', action: 'View', rating2: '★ ...'},
  {id: 'perf-7', airline: 'Tunis...', destinations: 'M..', scheduledAt: '3/21/...', status: '🔴', rating: '★ ...', progress: '━━━━', url: 'https...', overbooked: '☐', action: 'View', rating2: '★ ...'},
  {id: 'perf-8', airline: 'LATA...', destinations: 'C..', scheduledAt: '11/28...', status: '🟢', rating: '★ ...', progress: '━━━━', url: 'https...', overbooked: '☐', action: 'View', rating2: '★ ...'},
  {id: 'perf-9', airline: 'EasyJet', destinations: 'M..', scheduledAt: '4/30/...', status: '🔴', rating: '★ ...', progress: '━━━━', url: 'https...', overbooked: '☑', action: 'View', rating2: '★ ...'},
  {id: 'perf-10', airline: 'Air N...', destinations: 'B..', scheduledAt: '6/19/...', status: '🔴', rating: '★ ...', progress: '━━━━', url: 'https...', overbooked: '☑', action: 'View', rating2: '★ ...'},
  {id: 'perf-11', airline: 'Copa...', destinations: 'C..', scheduledAt: '9/19/...', status: '🟠', rating: '★ ...', progress: '━━━━', url: 'https...', overbooked: '☐', action: 'View', rating2: '★ ...'},
  {id: 'perf-12', airline: 'Unite...', destinations: 'P..', scheduledAt: '3/18/...', status: '🟠', rating: '★ ...', progress: '━━━━', url: 'https...', overbooked: '☑', action: 'View', rating2: '★ ...'},
  {id: 'perf-13', airline: 'Virgi...', destinations: 'C..', scheduledAt: '4/19/...', status: '🟢', rating: '★ ...', progress: '━━━━', url: 'https...', overbooked: '☑', action: 'View', rating2: '★ ...'},
  {id: 'perf-14', airline: 'Asian...', destinations: 'L..', scheduledAt: '9/22/...', status: '🟠', rating: '★ ...', progress: '━━━━', url: 'https...', overbooked: '☐', action: 'View', rating2: '★ ...'}
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
    ariaLabel: 'TableView with static contents',
    columns: BASE_COLUMNS,
    rows: STATIC_ROWS,
    rowKey: 'foo',
    width: 300,
    height: 200
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
    height: {
      control: 'text'
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
      control: 'select',
      options: ['none', 'single', 'multiple']
    },
    sortDescriptor: {
      table: {
        disable: true
      }
    },
    visibility: {
      control: 'select',
      options: ['hidden', 'visible']
    },
    width: {
      control: 'text'
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

function renderAsyncTable(args: StoryArgs, loadMoreEnabled = false, wrap = false) {
  return {
    components: {Table},
    setup() {
      let allRows = [...BASE_ROWS, ...MANY_ROWS.slice(0, 10)];
      let rows = ref<TableRow[]>([]);
      let loading = ref(false);

      let loadRows = (append = false) => {
        loading.value = true;
        setTimeout(() => {
          if (append) {
            rows.value = [...rows.value, ...allRows.slice(rows.value.length, rows.value.length + 5)];
          } else {
            rows.value = allRows.slice(0, 8);
          }
          loading.value = false;
        }, 1500);
      };

      loadRows(false);

      return {
        args,
        loadMoreEnabled,
        loadRows,
        loading,
        rows,
        wrap
      };
    },
    template: `
      <div>
        <Table
          v-bind="args"
          :rows="rows"
          :loading-state="loading ? (loadMoreEnabled ? 'loadingMore' : 'loading') : 'idle'"
          :overflow-mode="wrap ? 'wrap' : args.overflowMode" />
      </div>
    `
  };
}

function renderAsyncLoadingNewsShell(args: StoryArgs) {
  return {
    components: {ActionButton, Table},
    setup() {
      let rows = ref<TableRow[]>([]);
      return {
        args,
        rows
      };
    },
    template: `
      <div>
        <ActionButton style="margin-bottom: 10px;">Remove first item</ActionButton>
        <Table v-bind="args" :rows="rows" />
      </div>
    `
  };
}

function renderSearchTable(args: StoryArgs, rowsSource: TableRow[]) {
  return {
    components: {Table},
    setup() {
      let query = ref('');
      let rows = computed(() => {
        let needle = query.value.trim().toLowerCase();
        if (!needle) {
          return rowsSource;
        }

        return rowsSource.filter((row) =>
          String(row.name ?? '').toLowerCase().includes(needle)
        );
      });
      return {
        args,
        query,
        rows
      };
    },
    template: `
      <div>
        <input
          v-model="query"
          type="text"
          aria-label="Search by name"
          style="margin: 8px 0 8px 8px; width: 320px;" />
        <Table v-bind="args" :rows="rows" />
      </div>
    `
  };
}

function renderControllingResizeTable(args: StoryArgs, columns: TableColumn[]) {
  return {
    components: {Button, Table},
    setup() {
      let renderKey = ref(0);
      let currentColumns = ref(columns.map((column) => ({...column})));
      let savedWidths = ref(currentColumns.value.map((column) => ({key: column.key, width: column.width ?? null})));
      let saveCols = () => {
        savedWidths.value = currentColumns.value.map((column) => ({key: column.key, width: column.width ?? null}));
      };
      let restoreCols = () => {
        let widthMap = new Map(savedWidths.value.map((entry) => [entry.key, entry.width]));
        currentColumns.value = currentColumns.value.map((column) => ({
          ...column,
          width: widthMap.get(column.key) ?? undefined
        }));
        renderKey.value++;
      };
      let savedLabel = computed(() => `{${savedWidths.value.map((entry) => `${entry.key} => ${entry.width ?? 'null'}`).join(',')}}`);
      return {
        args,
        currentColumns,
        renderKey,
        rows: POKEMON_ROWS,
        restoreCols,
        saveCols,
        savedLabel
      };
    },
    template: `
      <div>
        <div style="display: flex; gap: 8px; margin-bottom: 8px;">
          <Button variant="accent" @click="saveCols">Save Cols</Button>
          <Button variant="accent" @click="restoreCols">Restore Cols</Button>
        </div>
        <div>Current saved column state: {{savedLabel}}</div>
        <div :key="renderKey">
          <Table v-bind="args" :columns="currentColumns" :rows="rows" row-key="id" />
        </div>
      </div>
    `
  };
}

export const Static: Story = {
  name: 'static',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS,
    rows: STATIC_ROWS,
    width: 300,
    height: 200
  }
};

export const Dynamic: Story = {
  name: 'dynamic',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS,
    rows: [...BASE_ROWS],
    width: 300,
    height: 200,
    rowKey: 'foo'
  }
};

export const DynamicFalsyRowKeys: Story = {
  name: 'dynamic, falsy row keys',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS,
    rows: FALSY_ROW_KEY_ROWS,
    rowKey: 'id',
    width: 300,
    height: 200
  }
};

export const HorizontalScrollingOnly: Story = {
  name: 'horizontal scrolling only',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS.slice(0, 3),
    rowKey: 'foo',
    width: 200,
    height: 220
  }
};

export const HorizontalScrollingOnlyFlushBottom: Story = {
  name: 'horizontal scrolling only flush bottom',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS.slice(0, 3),
    rowKey: 'foo',
    width: 200,
    height: 174
  }
};

export const DynamicWithDisabledKeys: Story = {
  name: 'dynamic with disabled keys',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS,
    rowKey: 'foo',
    disabledKeys: new Set(['Foo 2', 'Foo 4']),
    width: 300,
    height: 200
  }
};

export const DynamicShowDividers: Story = {
  name: 'dynamic showDividers',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS.map((column, index) => ({...column, showDivider: index < BASE_COLUMNS.length - 1})),
    rows: BASE_ROWS,
    rowKey: 'foo',
    width: 300,
    height: 200
  }
};

export const DynamicSelectedKeys: Story = {
  name: 'selectedKeys',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS,
    rowKey: 'foo',
    selectionMode: 'multiple',
    modelValue: new Set(['Foo 2', 'Foo 4']),
    width: 300,
    height: 200
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
    rows: BASE_ROWS,
    rowKey: 'foo',
    width: 300,
    height: 200
  }
};

export const DynamicNestedColumns: Story = {
  name: 'dynamic with nested columns',
  render: (args) => renderTable(args),
  args: {
    columns: NESTED_COLUMNS,
    rows: [...BASE_ROWS],
    rowKey: 'foo',
    width: 700,
    height: 300
  }
};

export const DynamicNestedColumnsWithResizing: Story = {
  name: 'dynamic with nested columns with resizing',
  render: (args) => renderTable(args),
  args: {
    columns: NESTED_COLUMNS,
    rows: BASE_ROWS,
    rowKey: 'foo',
    width: 700,
    height: 300,
    resizableColumns: NESTED_COLUMNS.map((column) => column.key)
  }
};

export const TableColSpanExample: Story = {
  render: (args) => renderTable(args),
  args: {
    columns: [
      {key: 'time', label: 'Time'},
      {key: 'mon', label: 'Monday'},
      {key: 'tue', label: 'Tuesday'},
      {key: 'wed', label: 'Wednesday'},
      {key: 'thu', label: 'Thursday'},
      {key: 'fri', label: 'Friday'}
    ],
    rows: [
      {id: 't1', time: '09:00', mon: 'Break', tue: '', wed: '', thu: '', fri: ''},
      {id: 't2', time: '08:00', mon: 'Math', tue: 'History', wed: 'Science', thu: 'English', fri: 'Art'},
      {id: 't3', time: '09:00', mon: 'Break', tue: '', wed: '', thu: '', fri: ''},
      {id: 't4', time: '10:00', mon: 'Math', tue: 'History', wed: 'Science', thu: 'English', fri: 'Art'},
      {id: 't5', time: '11:00', mon: 'Math', tue: 'History', wed: 'Science', thu: 'English', fri: 'Art'},
      {id: 't6', time: '12:00', mon: 'Break', tue: '', wed: '', thu: '', fri: ''},
      {id: 't7', time: '13:00', mon: 'History', tue: 'Math', wed: 'English', thu: 'Science', fri: 'Art'}
    ],
    rowKey: 'id',
    width: 450,
    height: 220
  }
};

export const TableCellColSpanWithVariousSpansExample: Story = {
  render: (args) => renderTable(args),
  args: {
    columns: [
      {key: 'foo', label: 'Foo', colspan: 1},
      {key: 'bar', label: 'Bar', colspan: 2},
      {key: 'baz', label: 'Baz'}
    ],
    rows: BASE_ROWS,
    rowKey: 'foo',
    width: 300,
    height: 200
  }
};

export const FocusableCells: Story = {
  name: 'focusable cells',
  render: (args) => renderFocusableTable(args),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS.slice(0, 4),
    rowKey: 'foo',
    width: 450,
    height: 200
  }
};

export const ManyColumnsAndRows: Story = {
  name: 'many columns and rows',
  render: (args) => renderFocusableTable(args),
  args: {
    columns: MANY_COLUMNS,
    rows: MANY_ROWS,
    rowKey: 'id',
    width: 700,
    height: 500
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
    columns: [
      {key: 'fileName', label: 'File Name'},
      {key: 'type', label: 'Type', align: 'center'},
      {key: 'size', label: 'Size', align: 'end'},
      {key: 'description', label: 'Description'}
    ],
    rows: [
      {id: 'f1', fileName: '2018 Proposal', type: 'PDF', size: '214 KB', description: 'very very very very very very long long long long long description'},
      {id: 'f2', fileName: 'Budget', type: 'XLS', size: '120 KB', description: 'very very very very very very long long long long long description'}
    ],
    width: 500,
    height: 200
  }
};

export const ColumnWidthsAndDividers: Story = {
  name: 'column widths and dividers',
  render: (args) => renderTable(args),
  args: {
    columns: [
      {key: 'fileName', label: 'File Name', width: 250, showDivider: true},
      {key: 'type', label: 'Type'},
      {key: 'size', label: 'Size', align: 'end'}
    ],
    rows: [
      {id: 'c1', fileName: '2018 Proposal', type: 'PDF', size: '214 KB'},
      {id: 'c2', fileName: 'Budget', type: 'XLS', size: '120 KB'}
    ],
    width: 500,
    height: 200
  }
};

export const CellWithLongContent: Story = {
  name: 'cell with long content',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS,
    rows: LONG_CONTENT_ROWS,
    rowKey: 'id',
    overflowMode: 'wrap',
    width: 500,
    height: 200
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
    rows: BASE_ROWS,
    rowKey: 'foo',
    width: 300,
    height: 200
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
          foo: `Foo ${nextId.value}`,
          bar: `Bar ${nextId.value}`,
          baz: `Baz ${nextId.value}`
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
    rows: BASE_ROWS,
    rowKey: 'foo',
    width: 500,
    height: 300
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
            Delete {{row.foo}}
          </ActionButton>
        </div>
        <Table v-bind="args" :rows="rows" />
      </div>
    `
  }),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS,
    rowKey: 'foo',
    width: 500,
    height: 300
  }
};

export const HidingColumnsExample: Story = {
  name: 'hiding columns',
  render: (args) => ({
    components: {Table},
    setup() {
      let showAudienceType = ref(true);
      let showNetBudget = ref(true);
      let showTargetOtp = ref(true);
      let showReach = ref(true);
      let columns = computed(() => {
        let visibleColumns: TableColumn[] = [
          {key: 'planName', label: 'Plan Name'}
        ];
        if (showAudienceType.value) {
          visibleColumns.push({key: 'audienceType', label: 'Audience Type'});
        }
        if (showNetBudget.value) {
          visibleColumns.push({key: 'netBudget', label: 'Net Budget'});
        }
        if (showTargetOtp.value) {
          visibleColumns.push({key: 'targetOtp', label: 'Target OTP'});
        }
        if (showReach.value) {
          visibleColumns.push({key: 'reach', label: 'Reach'});
        }
        return visibleColumns;
      });
      return {
        args,
        columns,
        rows: PLAN_ROWS,
        showAudienceType,
        showNetBudget,
        showReach,
        showTargetOtp
      };
    },
    template: `
      <div style="display: flex; gap: 16px; align-items: flex-start;">
        <div style="display: grid; gap: 8px; min-width: 120px;">
          <label><input v-model="showAudienceType" type="checkbox" /> Audience Type</label>
          <label><input v-model="showNetBudget" type="checkbox" /> Net Budget</label>
          <label><input v-model="showTargetOtp" type="checkbox" /> Target OTP</label>
          <label><input v-model="showReach" type="checkbox" /> Reach</label>
        </div>
        <Table v-bind="args" :columns="columns" :rows="rows" row-key="id" />
      </div>
    `
  }),
  args: {
    columns: BASE_COLUMNS,
    rows: [],
    rowKey: 'id',
    width: 900,
    height: 300
  }
};

export const IsLoading: Story = {
  name: 'isLoading',
  render: (args) => renderTable(args),
  args: {
    columns: MANY_COLUMNS,
    rows: [],
    rowKey: 'id',
    loadingState: 'loading',
    width: 700,
    height: 200
  }
};

export const IsLoadingMore: Story = {
  name: 'isLoading more',
  render: (args) => renderTable(args),
  args: {
    columns: MANY_COLUMNS,
    rows: [],
    rowKey: 'id',
    loadingState: 'loadingMore',
    width: 700,
    height: 200
  }
};

export const Filtering: Story = {
  name: 'filtering',
  render: (args) => renderTable(args),
  args: {
    columns: BASE_COLUMNS,
    rows: BASE_ROWS,
    rowKey: 'foo',
    loadingState: 'filtering',
    width: 700,
    height: 200
  }
};

export const EmptyStateStory: Story = {
  name: 'renderEmptyState',
  render: (args) => ({
    components: {Table},
    setup() {
      let showItems = ref(false);
      let columns = MANY_COLUMNS.slice(0, 7);
      let rows = computed(() => showItems.value ? MANY_ROWS.slice(0, 8) : []);
      return {
        args,
        columns,
        rows,
        showItems
      };
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <button type="button" @click="showItems = !showItems">Toggle items</button>
        <Table v-bind="args" :columns="columns" :rows="rows" row-key="id" />
        <div v-if="!showItems" style="display: grid; place-items: center; gap: 6px; margin-top: -190px; pointer-events: none;">
          <svg width="70" height="48" viewBox="0 0 150 103" aria-hidden="true">
            <path d="M133.7,8.5h-118c-1.9,0-3.5,1.6-3.5,3.5v27c0,0.8,0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5V23.5h119V92c0,0.3-0.2,0.5-0.5,0.5h-118c-0.3,0-0.5-0.2-0.5-0.5V69c0-0.8-0.7-1.5-1.5-1.5s-1.5,0.7-1.5,1.5v23c0,1.9,1.6,3.5,3.5,3.5h118c1.9,0,3.5-1.6,3.5-3.5V12C137.2,10.1,135.6,8.5,133.7,8.5z M15.2,21.5V12c0-0.3,0.2-0.5,0.5-0.5h118c0.3,0,0.5,0.2,0.5,0.5v9.5H15.2z" fill="currentColor" />
          </svg>
          <strong>No results</strong>
          <span>No results found, press <a href="#">here</a> for more info.</span>
        </div>
      </div>
    `
  }),
  args: {
    columns: MANY_COLUMNS.slice(0, 7),
    rows: [],
    width: 700,
    height: 400
  }
};

export const AsyncLoading: Story = {
  name: 'async loading',
  render: (args) => renderAsyncLoadingNewsShell(args),
  args: {
    columns: ASYNC_NEWS_COLUMNS,
    rows: [],
    rowKey: 'id',
    selectionMode: 'multiple',
    width: 1000,
    height: 400
  }
};

export const AsyncLoadingQuarryTest: Story = {
  name: 'async reload on sort',
  render: (args) => renderTable(args),
  args: {
    columns: QUARRY_COLUMNS,
    rows: QUARRY_ROWS,
    rowKey: 'id',
    selectionMode: 'multiple',
    width: '90vw',
    height: 400
  }
};

export const HideHeader: Story = {
  name: 'hideHeader',
  render: (args) => renderTable(args),
  args: {
    columns: [
      {key: 'foo', label: 'Foo'},
      {key: 'addAction', label: 'Add Info', hideHeader: true},
      {key: 'deleteAction', label: 'Delete Item', hideHeader: true, showDivider: true},
      {key: 'bar', label: 'Bar'},
      {key: 'baz', label: 'Baz'}
    ],
    rows: Array.from({length: 6}, (_, index) => ({
      id: `h${index}`,
      foo: 'One',
      addAction: 'Add',
      deleteAction: 'Delete',
      bar: 'Two',
      baz: 'Three'
    })),
    rowKey: 'id',
    width: 350,
    height: 200
  }
};

export const AsyncLoadingClientFiltering: Story = {
  name: 'async client side filter loading',
  render: (args) => renderSearchTable(args, PROJECT_ROWS),
  args: {
    columns: PROJECT_COLUMNS,
    rows: PROJECT_ROWS,
    rowKey: 'id',
    ariaLabel: 'Project list',
    width: 600,
    height: 700
  }
};

export const AsyncLoadingServerFiltering: Story = {
  name: 'async server side filter loading',
  render: (args) => renderSearchTable(args, STAR_WARS_ROWS),
  args: {
    columns: STAR_WARS_COLUMNS,
    rows: STAR_WARS_ROWS,
    rowKey: 'id',
    ariaLabel: 'Star Wars Characters',
    width: 600,
    height: 200
  }
};

export const AsyncLoadingServerFilteringLoadMore: Story = {
  name: 'loads more on scroll when contentSize.height < rect.height * 2',
  render: (args) => renderSearchTable(args, STAR_WARS_ROWS),
  args: {
    columns: STAR_WARS_COLUMNS,
    rows: STAR_WARS_ROWS,
    rowKey: 'id',
    ariaLabel: 'Star Wars Characters',
    height: 500,
    width: 600
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
    rows: STATIC_ROWS,
    rowKey: 'foo',
    width: 300,
    height: 200
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
    rows: BASE_ROWS,
    rowKey: 'foo',
    width: 500,
    height: 300
  }
};

export const ResizingUncontrolledDynamicWidths: Story = {
  name: 'allowsResizing, uncontrolled, dynamic widths',
  render: (args) => renderFocusableTable(args),
  args: {
    columns: [
      {key: 'fileName', label: 'File Name'},
      {key: 'type', label: 'Type'},
      {key: 'size', label: 'Size'},
      {key: 'weight', label: 'Weight'}
    ],
    rows: [
      {id: 'r1', fileName: '2018 Proposal', type: 'PDF', size: '214 KB', weight: '1 LB'},
      {id: 'r2', fileName: 'Budget', type: 'XLS', size: '120 KB', weight: '20 LB'}
    ],
    rowKey: 'id',
    width: 800,
    height: 200,
    resizableColumns: ['fileName', 'type', 'size', 'weight']
  }
};

export const ResizingUncontrolledStaticWidths: Story = {
  name: 'allowsResizing, uncontrolled, static widths',
  render: (args) => renderTable(args),
  args: {
    columns: [
      {key: 'fileName', label: 'File Name', width: '50%'},
      {key: 'type', label: 'Type', width: '20%'},
      {key: 'size', label: 'Size', width: 239}
    ],
    rows: [
      {id: 'r1', fileName: '2018 Proposal', type: 'PDF', size: '214 KB'},
      {id: 'r2', fileName: 'Budget', type: 'XLS', size: '120 KB'}
    ],
    rowKey: 'id',
    width: 800,
    height: 200,
    resizableColumns: ['fileName', 'type', 'size']
  }
};

export const ResizingUncontrolledColumnDivider: Story = {
  name: 'allowsResizing, uncontrolled, column divider',
  render: (args) => renderTable(args),
  args: {
    columns: [
      {key: 'fileName', label: 'File Name', showDivider: true},
      {key: 'type', label: 'Type'},
      {key: 'size', label: 'Size'}
    ],
    rows: [
      {id: 'r1', fileName: '2018 Proposal', type: 'PDF', size: '214 KB'},
      {id: 'r2', fileName: 'Budget', type: 'XLS', size: '120 KB'}
    ],
    rowKey: 'id',
    width: 800,
    height: 200,
    resizableColumns: ['fileName', 'type', 'size']
  }
};

export const ResizingUncontrolledMinMax: Story = {
  name: 'allowsResizing, uncontrolled, min/max widths',
  render: (args) => renderTable(args),
  args: {
    columns: [
      {key: 'fileName', label: 'File Name', width: 200, minWidth: 175, maxWidth: 300},
      {key: 'size', label: 'Size', width: '1fr', minWidth: 175, maxWidth: 500},
      {key: 'type', label: 'Type', width: 200, minWidth: 175, maxWidth: 300}
    ],
    rows: [
      {id: 'r1', fileName: '2018 Proposal', type: 'PDF', size: '214 KB'},
      {id: 'r2', fileName: 'Budget', type: 'XLS', size: '120 KB'}
    ],
    rowKey: 'id',
    width: 800,
    height: 200,
    resizableColumns: ['fileName', 'type', 'size']
  }
};

export const ResizingUncontrolledSomeNotAllowed: Story = {
  name: 'allowsResizing, uncontrolled, some columns not allowed resizing',
  render: (args) => renderTable(args),
  args: {
    columns: [
      {key: 'fileName', label: 'File Name'},
      {key: 'type', label: 'Type'},
      {key: 'size', label: 'Size'},
      {key: 'weight', label: 'Weight'}
    ],
    rows: [
      {id: 'r1', fileName: '2018 Proposal', type: 'PDF', size: '214 KB', weight: '1 LB'},
      {id: 'r2', fileName: 'Budget', type: 'XLS', size: '120 KB', weight: '20 LB'}
    ],
    rowKey: 'id',
    width: 800,
    height: 200,
    resizableColumns: ['fileName', 'weight']
  }
};

export const ResizingUncontrolledNoHeightWidth: Story = {
  name: 'allowsResizing, uncontrolled, undefined table width and height',
  render: (args) => renderTable(args),
  args: {
    columns: [
      {key: 'fileName', label: 'File Name', width: 150},
      {key: 'type', label: 'Type', width: 100},
      {key: 'size', label: 'Size', width: 100},
      {key: 'weight', label: 'Weight', width: 100}
    ],
    rows: [
      {id: 'r1', fileName: '2018 Proposal', type: 'PDF', size: '214 KB', weight: '1 LB'},
      {id: 'r2', fileName: 'Budget', type: 'XLS', size: '120 KB', weight: '20 LB'}
    ],
    rowKey: 'id',
    resizableColumns: ['fileName', 'type', 'size', 'weight']
  }
};

export const ResizingUncontrolledSortableColumns: Story = {
  name: 'allowsResizing, uncontrolled, sortable columns',
  render: (args) => renderAsyncLoadingNewsShell(args),
  args: {
    columns: ASYNC_NEWS_COLUMNS,
    rows: [],
    rowKey: 'id',
    width: 1000,
    height: 400,
    selectionMode: 'multiple',
    resizableColumns: ['score', 'title', 'author', 'num_comments'],
    sortDescriptor: {
      column: 'score',
      direction: 'ascending'
    }
  }
};

export const ResizingManyColumnsRows: Story = {
  name: 'allowsResizing, many columns and rows',
  render: (args) => renderFocusableTable(args),
  args: {
    columns: MANY_COLUMNS,
    rows: MANY_ROWS,
    rowKey: 'id',
    width: 700,
    height: 500,
    resizableColumns: MANY_COLUMNS.map((column) => column.key)
  }
};

export const ResizingHidingColumns: Story = {
  name: 'allowsResizing, hiding columns',
  render: (args) => ({
    components: {Table},
    setup() {
      let showAudienceType = ref(true);
      let showNetBudget = ref(true);
      let showTargetOtp = ref(true);
      let showReach = ref(true);
      let columns = computed(() => {
        let visibleColumns: TableColumn[] = [{key: 'planName', label: 'Plan Name'}];
        if (showAudienceType.value) {
          visibleColumns.push({key: 'audienceType', label: 'Audience Type', sortable: true});
        }
        if (showNetBudget.value) {
          visibleColumns.push({key: 'netBudget', label: 'Net Budget', sortable: true});
        }
        if (showTargetOtp.value) {
          visibleColumns.push({key: 'targetOtp', label: 'Target OTP'});
        }
        if (showReach.value) {
          visibleColumns.push({key: 'reach', label: 'Reach'});
        }
        return visibleColumns;
      });
      let resizableColumns = computed(() => columns.value.map((column) => column.key));
      return {
        args,
        columns,
        resizableColumns,
        rows: PLAN_ROWS,
        showAudienceType,
        showNetBudget,
        showReach,
        showTargetOtp
      };
    },
    template: `
      <div style="display: flex; gap: 16px; align-items: flex-start;">
        <div style="display: grid; gap: 8px; min-width: 120px;">
          <label><input v-model="showAudienceType" type="checkbox" /> Audience Type</label>
          <label><input v-model="showNetBudget" type="checkbox" /> Net Budget</label>
          <label><input v-model="showTargetOtp" type="checkbox" /> Target OTP</label>
          <label><input v-model="showReach" type="checkbox" /> Reach</label>
        </div>
        <Table v-bind="args" :columns="columns" :rows="rows" :resizable-columns="resizableColumns" row-key="id" />
      </div>
    `
  }),
  args: {
    columns: [],
    rows: PLAN_ROWS,
    rowKey: 'id',
    width: 900,
    height: 300,
    resizableColumns: ['planName', 'audienceType', 'netBudget', 'targetOtp', 'reach']
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
    columns: [
      {key: 'name', label: 'Name', width: 200},
      {key: 'type', label: 'Type', width: 200},
      {key: 'height', label: 'Height', width: 200},
      {key: 'weight', label: 'Weight', width: 200}
    ],
    rows: [
      {id: 'z1', name: 'Bulbasaur', type: 'Grass', height: '2\'04\"', weight: '15.2 lbs'},
      {id: 'z2', name: 'Ivysaur', type: 'Grass', height: '3\'03\"', weight: '28.7 lbs'}
    ],
    rowKey: 'id',
    width: 900,
    height: 300,
    resizableColumns: ['name', 'type', 'height', 'weight']
  },
  parameters: {
    description: {
      data: 'Using browser zoom should not trigger an infinite resizing loop. CMD+"+" to zoom in and CMD+"-" to zoom out.'
    }
  }
};

export const ResizingControlledNoInitialWidths: Story = {
  name: 'allowsResizing, controlled, no widths',
  render: (args) => renderControllingResizeTable(args, [
    {key: 'name', label: 'Name'},
    {key: 'type', label: 'Type'},
    {key: 'height', label: 'Height'},
    {key: 'weight', label: 'Weight'},
    {key: 'level', label: 'Level'}
  ]),
  args: {
    columns: [
      {key: 'name', label: 'Name'},
      {key: 'type', label: 'Type'},
      {key: 'height', label: 'Height'},
      {key: 'weight', label: 'Weight'},
      {key: 'level', label: 'Level'}
    ],
    rows: [
      {id: 'p1', name: 'Bulbasaur', type: 'Grass', height: '2\'04\"', weight: '15.2 lbs', level: '5'},
      {id: 'p2', name: 'Ivysaur', type: 'Grass', height: '3\'03\"', weight: '28.7 lbs', level: '16'}
    ],
    rowKey: 'id',
    width: 900,
    height: 500,
    resizableColumns: ['name', 'type', 'height', 'weight', 'level']
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
  render: (args) => renderControllingResizeTable(args, [
    {key: 'name', label: 'Name', width: '1fr'},
    {key: 'type', label: 'Type', width: '1fr'},
    {key: 'height', label: 'Height'},
    {key: 'weight', label: 'Weight'},
    {key: 'level', label: 'Level', width: '4fr'}
  ]),
  args: {
    columns: [
      {key: 'name', label: 'Name', width: '1fr'},
      {key: 'type', label: 'Type', width: '1fr'},
      {key: 'height', label: 'Height'},
      {key: 'weight', label: 'Weight'},
      {key: 'level', label: 'Level', width: '4fr'}
    ],
    rows: [
      {id: 'p1', name: 'Bulbasaur', type: 'Grass', height: '2\'04\"', weight: '15.2 lbs', level: '5'},
      {id: 'p2', name: 'Ivysaur', type: 'Grass', height: '3\'03\"', weight: '28.7 lbs', level: '16'}
    ],
    rowKey: 'id',
    width: 900,
    height: 500,
    resizableColumns: ['name', 'type', 'height', 'weight', 'level']
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
  render: (args) => renderControllingResizeTable(args, [
    {key: 'name', label: 'Name', width: '1fr'},
    {key: 'type', label: 'Type', width: '1fr'},
    {key: 'level', label: 'Level', width: '4fr'}
  ]),
  args: {
    columns: [
      {key: 'name', label: 'Name', width: '1fr'},
      {key: 'type', label: 'Type', width: '1fr'},
      {key: 'level', label: 'Level', width: '4fr'}
    ],
    rows: [
      {id: 'p1', name: 'Bulbasaur', type: 'Grass', level: '5'},
      {id: 'p2', name: 'Ivysaur', type: 'Grass', level: '16'}
    ],
    rowKey: 'id',
    width: 900,
    height: 500,
    resizableColumns: ['name', 'type', 'level']
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
  render: (args) => renderControllingResizeTable(args, [
    {key: 'name', label: 'Name', hideHeader: true},
    {key: 'type', label: 'Type', width: 300, hideHeader: true},
    {key: 'level', label: 'Level', width: '4fr'}
  ]),
  args: {
    columns: [
      {key: 'name', label: 'Name', hideHeader: true},
      {key: 'type', label: 'Type', width: 300, hideHeader: true},
      {key: 'level', label: 'Level', width: '4fr'}
    ],
    rows: [
      {id: 'p1', name: 'Bulbasaur', type: 'Grass', level: '5'},
      {id: 'p2', name: 'Ivysaur', type: 'Grass', level: '16'}
    ],
    rowKey: 'id',
    width: 900,
    height: 500,
    resizableColumns: ['name', 'type', 'level']
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
      let typeAheadRows = [
        ...Array.from({length: 100}, (_, index) => ({id: index, firstname: 'Aubrey', lastname: 'Sheppard', birthday: 'May 7', edit: 'Edit'})),
        {id: 101, firstname: 'John', lastname: 'Doe', birthday: 'May 7', edit: 'Edit'}
      ] as TableRow[];
      let filteredRows = computed(() => {
        let needle = query.value.toLowerCase();
        if (!needle) {
          return typeAheadRows;
        }
        return typeAheadRows.filter((row) => String(row.firstname ?? '').toLowerCase().includes(needle));
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
    columns: [
      {key: 'firstname', label: 'First Name'},
      {key: 'lastname', label: 'Last Name'},
      {key: 'birthday', label: 'Birthday'},
      {key: 'edit', label: 'Edit'}
    ],
    rows: [],
    rowKey: 'id',
    selectionMode: 'none',
    height: '90vh'
  }
};

export const Links: Story = {
  render: (args) => renderTable(args),
  args: {
    columns: [
      {key: 'name', label: 'Name'},
      {key: 'url', label: 'URL'},
      {key: 'dateAdded', label: 'Date added'}
    ],
    rows: [
      {id: 'https://adobe.com/', name: 'Adobe', url: 'https://adobe.com/', dateAdded: 'January 28, 2023'},
      {id: 'https://google.com/', name: 'Google', url: 'https://google.com/', dateAdded: 'April 5, 2023'},
      {id: 'https://apple.com/', name: 'Apple', url: 'https://apple.com/', dateAdded: 'June 5, 2023'},
      {id: 'https://nytimes.com/', name: 'New York Times', url: 'https://nytimes.com/', dateAdded: 'July 12, 2023'}
    ],
    rowKey: 'id'
  }
};

export const ColumnHeaderFocusRingTable: Story = {
  name: 'column header focus after loading',
  render: (args) => renderTable(args),
  args: {
    columns: [
      {key: 'name', label: 'Name'},
      {key: 'height', label: 'Height', sortable: true},
      {key: 'birthday', label: 'Birthday'}
    ],
    rows: [
      {id: 'sam', name: 'Sam', height: 66, birthday: 'May 3'},
      {id: 'julia', name: 'Julia', height: 70, birthday: 'February 10'}
    ],
    rowKey: 'id',
    selectionMode: 'multiple',
    height: 300
  },
  parameters: {
    description: {
      data: 'Column header should remain focused even if the table collections empties/loading state changes to loading'
    }
  }
};

export const AsyncLoadOverflowWrapReproStory: Story = {
  name: 'async, overflow wrap scroll jumping reproduction',
  render: (args) => renderTable(args),
  args: {
    columns: STAR_WARS_COLUMNS,
    rows: STAR_WARS_WRAP_ROWS,
    rowKey: 'id',
    height: 'size-3000',
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
    columns: PERFORMANCE_COLUMNS,
    rows: PERFORMANCE_ROWS,
    rowKey: 'id',
    width: 800,
    height: 600,
    selectionMode: 'multiple'
  }
};
