import {action} from '@storybook/addon-actions';
import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VueButton, VueTable} from '@vue-spectrum/components';
import {ref} from 'vue';

type TableColumn = {
  key: string,
  label: string
};

type TableRow = Record<string, number | string>;
type StoryArgs = Record<string, unknown>;
type StyleMap = Record<string, number | string>;

const fileColumns: TableColumn[] = [
  {key: 'name', label: 'Name'},
  {key: 'type', label: 'Type'},
  {key: 'date', label: 'Date Modified'}
];

const fileRows: TableRow[] = [
  {id: 1, name: 'Games', date: '6/7/2020', type: 'File folder'},
  {id: 2, name: 'Program Files', date: '4/7/2021', type: 'File folder'},
  {id: 3, name: 'bootmgr', date: '11/20/2010', type: 'System file'},
  {id: 4, name: 'log.txt', date: '1/18/2016', type: 'Text document'}
];

const timeColumns: TableColumn[] = [
  {key: 'time', label: 'Time'},
  {key: 'monday', label: 'Monday'},
  {key: 'tuesday', label: 'Tuesday'},
  {key: 'wednesday', label: 'Wednesday'},
  {key: 'thursday', label: 'Thursday'},
  {key: 'friday', label: 'Friday'}
];

const timeRows: TableRow[] = [
  {id: 1, time: '08:00 - 09:00', monday: 'Math', tuesday: 'History', wednesday: 'Science', thursday: 'English', friday: 'Art'},
  {id: 2, time: '09:00 - 10:00', monday: 'Break', tuesday: 'Break', wednesday: 'Break', thursday: 'Break', friday: 'Break'},
  {id: 3, time: '10:00 - 11:00', monday: 'Math', tuesday: 'History', wednesday: 'Science', thursday: 'English', friday: 'Art'},
  {id: 4, time: '11:00 - 12:00', monday: 'Math', tuesday: 'History', wednesday: 'Science', thursday: 'English', friday: 'Art'},
  {id: 5, time: '12:00 - 13:00', monday: 'Break', tuesday: 'Break', wednesday: 'Break', thursday: 'Break', friday: 'Break'},
  {id: 6, time: '13:00 - 14:00', monday: 'History', tuesday: 'Math', wednesday: 'English', thursday: 'Science', friday: 'Art'}
];

const meta = {
  title: 'React Aria Components/Table',
  component: VueTable
} satisfies Meta<typeof VueTable>;

export default meta;

type TableStory = StoryFn<typeof VueTable>;
type Story = StoryObj<typeof meta>;

interface TableStoryOptions {
  actionName?: string,
  caption: string,
  columns: TableColumn[],
  containerStyle?: StyleMap,
  rows: TableRow[],
  showSelection?: boolean
}

function makeRows(count: number, prefix = 'Row'): TableRow[] {
  return Array.from({length: count}, (_, index) => ({
    id: index + 1,
    foo: `${prefix} ${index + 1} / Foo`,
    bar: `${prefix} ${index + 1} / Bar`,
    baz: `${prefix} ${index + 1} / Baz`
  }));
}

function createTableStory(args: StoryArgs = {}, options: TableStoryOptions) {
  return {
    components: {
      VueTable
    },
    setup() {
      let selected = ref<string | number>();
      return {
        args,
        caption: options.caption,
        columns: options.columns,
        containerStyle: options.containerStyle ?? {},
        onRowAction: action(options.actionName ?? 'onRowAction'),
        rows: options.rows,
        selected,
        showSelection: options.showSelection ?? true
      };
    },
    template: `
      <div :style="containerStyle">
        <VueTable
          v-bind="args"
          v-model="selected"
          :caption="caption"
          :columns="columns"
          :rows="rows"
          @rowAction="onRowAction" />
        <p v-if="showSelection" style="margin-top: 8px;">Selected row: {{ selected ?? 'none' }}</p>
      </div>
    `
  };
}

export const ReorderableTableExample: TableStory = () => ({
  components: {
    VueTable
  },
  setup() {
    let columns: TableColumn[] = [
      {key: 'id', label: 'Id'},
      {key: 'name', label: 'Name'}
    ];
    let leftRows = ref<TableRow[]>([{id: '1', name: 'Bob'}]);
    let rightRows = ref<TableRow[]>([{id: '2', name: 'Alex'}]);
    let leftSelected = ref<string | number>();
    let rightSelected = ref<string | number>();
    let onRowAction = action('onRowAction');

    let moveRight = () => {
      if (leftSelected.value == null) {
        return;
      }

      let row = leftRows.value.find((item) => item.id === leftSelected.value);
      if (!row) {
        return;
      }

      leftRows.value = leftRows.value.filter((item) => item.id !== leftSelected.value);
      rightRows.value = [...rightRows.value, row];
      leftSelected.value = undefined;
    };

    let moveLeft = () => {
      if (rightSelected.value == null) {
        return;
      }

      let row = rightRows.value.find((item) => item.id === rightSelected.value);
      if (!row) {
        return;
      }

      rightRows.value = rightRows.value.filter((item) => item.id !== rightSelected.value);
      leftRows.value = [...leftRows.value, row];
      rightSelected.value = undefined;
    };

    return {
      columns,
      leftRows,
      leftSelected,
      moveLeft,
      moveRight,
      onRowAction,
      rightRows,
      rightSelected
    };
  },
  template: `
    <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start;">
      <div style="width: 300px; overflow: auto;">
        <VueTable
          v-model="leftSelected"
          caption="Reorderable table"
          :columns="columns"
          :rows="leftRows"
          @rowAction="onRowAction" />
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px; justify-content: center;">
        <button type="button" @click="moveRight">Move right</button>
        <button type="button" @click="moveLeft">Move left</button>
      </div>
      <div style="width: 300px; overflow: auto;">
        <VueTable
          v-model="rightSelected"
          caption="Reorderable table"
          :columns="columns"
          :rows="rightRows"
          @rowAction="onRowAction" />
      </div>
    </div>
  `
});

export const TableExampleStory: Story = {
  render: (args) => createTableStory(args, {
    caption: 'Example table',
    columns: fileColumns,
    containerStyle: {
      overflow: 'auto',
      width: '400px'
    },
    rows: fileRows
  }),
  args: {
    selectionMode: 'none',
    selectionBehavior: 'toggle',
    escapeKeyBehavior: 'clearSelection'
  },
  argTypes: {
    selectionMode: {
      control: 'radio',
      options: ['none', 'single', 'multiple']
    },
    selectionBehavior: {
      control: 'radio',
      options: ['toggle', 'replace']
    },
    escapeKeyBehavior: {
      control: 'radio',
      options: ['clearSelection', 'none']
    }
  }
};

export const TableDynamicExample: TableStory = () => createTableStory({}, {
  caption: 'Files',
  columns: fileColumns,
  rows: fileRows
});

export const TableCellColSpanExample: TableStory = () => createTableStory({}, {
  caption: 'Timetable',
  columns: timeColumns,
  rows: timeRows
});

export const TableCellColSpanWithVariousSpansExample: TableStory = () => createTableStory({}, {
  caption: 'Table with various colspans',
  columns: [
    {key: 'col1', label: 'Col 1'},
    {key: 'col2', label: 'Col 2'},
    {key: 'col3', label: 'Col 3'},
    {key: 'col4', label: 'Col 4'}
  ],
  rows: [
    {id: 1, col1: 'Cell', col2: 'Span 2 (part 1)', col3: 'Span 2 (part 2)', col4: 'Cell'},
    {id: 2, col1: 'Cell', col2: 'Cell', col3: 'Cell', col4: 'Cell'},
    {id: 3, col1: 'Span 4 (part 1)', col2: 'Span 4 (part 2)', col3: 'Span 4 (part 3)', col4: 'Span 4 (part 4)'},
    {id: 4, col1: 'Cell', col2: 'Cell', col3: 'Cell', col4: 'Cell'},
    {id: 5, col1: 'Span 3 (part 1)', col2: 'Span 3 (part 2)', col3: 'Span 3 (part 3)', col4: 'Cell'},
    {id: 6, col1: 'Cell', col2: 'Cell', col3: 'Cell', col4: 'Cell'}
  ]
});

interface DndTableExampleArgs {
  isDisabledFirstTable?: boolean,
  isDisabledSecondTable?: boolean,
  isLoading?: boolean
}

const dndTableRowsOne = [
  {id: '1', type: 'file', name: 'Adobe Photoshop'},
  {id: '2', type: 'file', name: 'Adobe XD'},
  {id: '3', type: 'folder', name: 'Documents'},
  {id: '4', type: 'file', name: 'Adobe InDesign'},
  {id: '5', type: 'folder', name: 'Utilities'},
  {id: '6', type: 'file', name: 'Adobe AfterEffects'}
];

const dndTableRowsTwo = [
  {id: '7', type: 'folder', name: 'Pictures'},
  {id: '8', type: 'file', name: 'Adobe Fresco'},
  {id: '9', type: 'folder', name: 'Apps'},
  {id: '10', type: 'file', name: 'Adobe Illustrator'},
  {id: '11', type: 'file', name: 'Adobe Lightroom'},
  {id: '12', type: 'file', name: 'Adobe Dreamweaver'}
];

export const DndTableExample: TableStory = (args: DndTableExampleArgs) => ({
  setup() {
    return {
      args,
      dndTableRowsOne,
      dndTableRowsTwo
    };
  },
  template: `
    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
      <table aria-label="First Table" aria-multiselectable="true" class="react-aria-Table" data-allows-dragging="true" data-rac="" role="grid" style="border-collapse: collapse;" tabindex="0">
        <thead class="react-aria-TableHeader" data-rac="" role="rowgroup">
          <tr role="row">
            <th class="react-aria-Column" data-rac="" role="columnheader"></th>
            <th class="react-aria-Column" data-rac="" role="columnheader">
              <label class="react-aria-Checkbox" data-rac="" slot="selection">
                <span style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;">
                  <input type="checkbox">
                </span>
                <div class="checkbox">
                  <svg aria-hidden="true" viewBox="0 0 18 18">
                    <polyline points="1 9 7 14 15 4"></polyline>
                  </svg>
                </div>
              </label>
            </th>
            <th class="react-aria-Column" data-rac="" role="columnheader">ID</th>
            <th class="react-aria-Column" data-rac="" role="columnheader">Name</th>
            <th class="react-aria-Column" data-rac="" role="columnheader">Type</th>
          </tr>
        </thead>
        <tbody class="react-aria-TableBody" data-rac="" role="rowgroup">
          <tr v-for="row in dndTableRowsOne" :key="row.id" aria-selected="false" class="react-aria-Row" data-rac="" data-selection-mode="multiple" role="row">
            <td class="react-aria-Cell" data-rac="" role="gridcell"><button class="react-aria-Button" data-rac="" style="pointer-events: none;" type="button">≡</button></td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">
              <label class="react-aria-Checkbox" data-rac="" slot="selection">
                <span style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;">
                  <input type="checkbox">
                </span>
                <div class="checkbox">
                  <svg aria-hidden="true" viewBox="0 0 18 18">
                    <polyline points="1 9 7 14 15 4"></polyline>
                  </svg>
                </div>
              </label>
            </td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">{{ row.id }}</td>
            <td class="react-aria-Cell" data-rac="" role="rowheader">{{ row.name }}</td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">{{ row.type }}</td>
          </tr>
          <tr inert="" style="height: 0px;">
            <td style="padding: 0px; border: 0px;">
              <div data-testid="loadMoreSentinel" style="position: relative; height: 1px; width: 1px;"></div>
            </td>
          </tr>
        </tbody>
      </table>
      <table aria-label="Second Table" aria-multiselectable="true" class="react-aria-Table" data-allows-dragging="true" data-rac="" role="grid" style="border-collapse: collapse;" tabindex="0">
        <thead class="react-aria-TableHeader" data-rac="" role="rowgroup">
          <tr role="row">
            <th class="react-aria-Column" data-rac="" role="columnheader"></th>
            <th class="react-aria-Column" data-rac="" role="columnheader">
              <label class="react-aria-Checkbox" data-rac="" slot="selection">
                <span style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;">
                  <input type="checkbox">
                </span>
                <div class="checkbox">
                  <svg aria-hidden="true" viewBox="0 0 18 18">
                    <polyline points="1 9 7 14 15 4"></polyline>
                  </svg>
                </div>
              </label>
            </th>
            <th class="react-aria-Column" data-rac="" role="columnheader">ID</th>
            <th class="react-aria-Column" data-rac="" role="columnheader">Name</th>
            <th class="react-aria-Column" data-rac="" role="columnheader">Type</th>
          </tr>
        </thead>
        <tbody class="react-aria-TableBody" data-rac="" role="rowgroup">
          <tr v-for="row in dndTableRowsTwo" :key="row.id" aria-selected="false" class="react-aria-Row" data-rac="" data-selection-mode="multiple" role="row">
            <td class="react-aria-Cell" data-rac="" role="gridcell"><button class="react-aria-Button" data-rac="" style="pointer-events: none;" type="button">≡</button></td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">
              <label class="react-aria-Checkbox" data-rac="" slot="selection">
                <span style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;">
                  <input type="checkbox">
                </span>
                <div class="checkbox">
                  <svg aria-hidden="true" viewBox="0 0 18 18">
                    <polyline points="1 9 7 14 15 4"></polyline>
                  </svg>
                </div>
              </label>
            </td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">{{ row.id }}</td>
            <td class="react-aria-Cell" data-rac="" role="rowheader">{{ row.name }}</td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">{{ row.type }}</td>
          </tr>
          <tr inert="" style="height: 0px;">
            <td style="padding: 0px; border: 0px;">
              <div data-testid="loadMoreSentinel" style="position: relative; height: 1px; width: 1px;"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
});

DndTableExample.args = {
  isDisabledFirstTable: false,
  isDisabledSecondTable: false,
  isLoading: false
};

export const DndTableWithNoValidDropTargets: Story = {
  render: () => ({
    setup() {
      return {dndTableRowsOne};
    },
    template: `
      <table aria-label="Table (rejects all item drops)" aria-multiselectable="true" class="react-aria-Table" data-allows-dragging="true" data-rac="" role="grid" style="border-collapse: collapse;" tabindex="0">
        <thead class="react-aria-TableHeader" data-rac="" role="rowgroup">
          <tr role="row">
            <th class="react-aria-Column" data-rac="" role="columnheader"></th>
            <th class="react-aria-Column" data-rac="" role="columnheader">
              <label class="react-aria-Checkbox" data-rac="" slot="selection">
                <span style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;">
                  <input type="checkbox">
                </span>
                <div class="checkbox">
                  <svg aria-hidden="true" viewBox="0 0 18 18">
                    <polyline points="1 9 7 14 15 4"></polyline>
                  </svg>
                </div>
              </label>
            </th>
            <th class="react-aria-Column" data-rac="" role="columnheader">ID</th>
            <th class="react-aria-Column" data-rac="" role="columnheader">Name</th>
            <th class="react-aria-Column" data-rac="" role="columnheader">Type</th>
          </tr>
        </thead>
        <tbody class="react-aria-TableBody" data-rac="" role="rowgroup">
          <tr v-for="row in dndTableRowsOne" :key="row.id" aria-selected="false" class="react-aria-Row" data-rac="" data-selection-mode="multiple" role="row">
            <td class="react-aria-Cell" data-rac="" role="gridcell"><button class="react-aria-Button" data-rac="" style="pointer-events: none;" type="button">≡</button></td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">
              <label class="react-aria-Checkbox" data-rac="" slot="selection">
                <span style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;">
                  <input type="checkbox">
                </span>
                <div class="checkbox">
                  <svg aria-hidden="true" viewBox="0 0 18 18">
                    <polyline points="1 9 7 14 15 4"></polyline>
                  </svg>
                </div>
              </label>
            </td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">{{ row.id }}</td>
            <td class="react-aria-Cell" data-rac="" role="rowheader">{{ row.name }}</td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">{{ row.type }}</td>
          </tr>
        </tbody>
      </table>
    `
  }),
  name: 'Dnd Table with no valid drop targets',
  parameters: {
    description: {
      data: 'Keyboard-drag parity fixture where all drop targets are rejected.'
    }
  }
};

export const TableLoadingBodyWrapperStory: Story = {
  render: (args: {isLoadingMore: boolean}) => createTableStory({}, {
    caption: args.isLoadingMore ? 'Files (loading more...)' : 'Files',
    columns: fileColumns,
    rows: fileRows
  }),
  args: {
    isLoadingMore: false
  },
  name: 'Table loading, table body wrapper with collection'
};

export const TableLoadingRowRenderWrapperStory: Story = {
  render: (args: {isLoadingMore: boolean}) => createTableStory({}, {
    caption: args.isLoadingMore ? 'Files (row loader active)' : 'Files',
    columns: fileColumns,
    rows: fileRows
  }),
  args: {
    isLoadingMore: false
  },
  name: 'Table loading, row renderer wrapper and dep array'
};

export const RenderEmptyStateStory: Story = {
  render: (args: {isLoading: boolean}) => ({
    components: {
      VueTable
    },
    setup() {
      return {
        args,
        columns: fileColumns,
        rows: args.isLoading ? fileRows : []
      };
    },
    template: `
      <div>
        <VueTable
          caption="Files"
          :columns="columns"
          :rows="rows" />
        <p style="margin-top: 8px;">{{ args.isLoading ? 'Loading rows...' : 'No results found' }}</p>
      </div>
    `
  }),
  args: {
    isLoading: false
  },
  name: 'Empty/Loading Table rendered with TableLoadingIndicator collection element'
};

interface LoadMoreArgs {
  delay?: number
}

function createLoadMoreTableStory(args: LoadMoreArgs = {}, options: {resizeWrapper?: boolean, virtualized?: boolean} = {}) {
  return {
    components: {
      VueTable
    },
    setup() {
      let columns: TableColumn[] = [
        {key: 'name', label: 'Name'},
        {key: 'height', label: 'Height'},
        {key: 'mass', label: 'Mass'}
      ];
      let selected = ref<string | number>();
      let rows = ref<TableRow[]>([]);
      let loading = ref(false);
      let page = ref(0);
      let onRowAction = action('onRowAction');

      let loadMore = () => {
        if (loading.value) {
          return;
        }
        loading.value = true;
        setTimeout(() => {
          let start = page.value * 10;
          let nextRows = Array.from({length: 10}, (_, index) => ({
            id: start + index + 1,
            name: `Character ${start + index + 1}`,
            height: 160 + ((start + index) % 40),
            mass: 60 + ((start + index) % 30)
          }));
          rows.value = [...rows.value, ...nextRows];
          page.value += 1;
          loading.value = false;
        }, args.delay ?? 50);
      };

      loadMore();

      return {
        columns,
        loadMore,
        loading,
        onRowAction,
        options,
        rows,
        selected
      };
    },
    template: `
      <div :style="options.resizeWrapper ? 'height: 150px; width: 400px; overflow: auto; resize: both; border: 1px solid #d9d9d9; padding: 8px;' : ''">
        <VueTable
          v-model="selected"
          :caption="options.virtualized ? 'Load more table virtualized' : 'Load more table'"
          :columns="columns"
          :rows="rows"
          @rowAction="onRowAction" />
        <button type="button" style="margin-top: 8px;" :disabled="loading" @click="loadMore">
          {{ loading ? 'Loading...' : 'Load more' }}
        </button>
      </div>
    `
  };
}

export const OnLoadMoreTableStory: Story = {
  render: (args: LoadMoreArgs) => createLoadMoreTableStory(args),
  name: 'onLoadMore table',
  args: {
    delay: 50
  }
};

export const VirtualizedTable: TableStory = () => createTableStory({}, {
  caption: 'virtualized table',
  columns: [
    {key: 'foo', label: 'Foo'},
    {key: 'bar', label: 'Bar'},
    {key: 'baz', label: 'Baz'}
  ],
  containerStyle: {
    height: '400px',
    overflow: 'auto',
    width: '400px'
  },
  rows: makeRows(1000)
});

export const VirtualizedTableWithResizing: TableStory = () => createTableStory({}, {
  caption: 'virtualized table',
  columns: [
    {key: 'foo', label: 'Foo'},
    {key: 'bar', label: 'Bar'},
    {key: 'baz', label: 'Baz'}
  ],
  containerStyle: {
    border: '1px solid #d9d9d9',
    height: '400px',
    overflow: 'auto',
    resize: 'both',
    width: '400px'
  },
  rows: makeRows(1000)
});

export const VirtualizedTableWithEmptyStateStory: Story = {
  render: (args: {isLoading: boolean, showRows: boolean}) => ({
    components: {
      VueTable
    },
    setup() {
      return {
        args,
        columns: [
          {key: 'foo', label: 'Foo'},
          {key: 'bar', label: 'Bar'},
          {key: 'baz', label: 'Baz'}
        ] as TableColumn[],
        rows: args.showRows ? makeRows(200) : []
      };
    },
    template: `
      <div style="height: 400px; width: 400px; overflow: auto; border: 1px solid #d9d9d9;">
        <VueTable
          caption="Virtualized table with empty state"
          :columns="columns"
          :rows="rows" />
        <p style="margin-top: 8px;">{{ args.isLoading ? 'Loading rows...' : rows.length ? 'Rows loaded' : 'No results found' }}</p>
      </div>
    `
  }),
  args: {
    isLoading: false,
    showRows: false
  },
  name: 'Virtualized Table With Empty State'
};

export const OnLoadMoreTableStoryVirtualized: Story = {
  render: (args: LoadMoreArgs) => createLoadMoreTableStory(args, {virtualized: true}),
  name: 'Virtualized Table with async loading',
  args: {
    delay: 50
  }
};

export const OnLoadMoreTableVirtualizedResizeWrapperStory: Story = {
  render: (args: LoadMoreArgs) => createLoadMoreTableStory(args, {resizeWrapper: true, virtualized: true}),
  name: 'Virtualized Table with async loading, with wrapper around Virtualizer',
  args: {
    delay: 50
  },
  parameters: {
    description: {
      data: 'Parity fixture with a resizable wrapper around the virtualized table.'
    }
  }
};

export const TableWithSuspense: Story = {
  render: (args: {reactTransition: boolean}) => ({
    components: {
      VueButton,
      VueTable
    },
    setup() {
      let columns: TableColumn[] = [
        {key: 'mission_name', label: 'Mission name'},
        {key: 'launch_year', label: 'Launch year'}
      ];
      let loading = ref(false);
      let rows = ref<TableRow[]>([
        {id: 0, mission_name: 'FalconSat', launch_year: 2006},
        {id: 1, mission_name: 'DemoSat', launch_year: 2007}
      ]);

      let loadNext = () => {
        loading.value = true;
        if (!args.reactTransition) {
          rows.value = [];
        }
        setTimeout(() => {
          rows.value = [
            {id: 0, mission_name: 'Trailblazer', launch_year: 2008},
            {id: 1, mission_name: 'RatSat', launch_year: 2009}
          ];
          loading.value = false;
        }, 1000);
      };

      return {
        columns,
        loadNext,
        loading,
        rows
      };
    },
    template: `
      <div>
        <VueButton @click="loadNext">{{ loading ? 'Loading...' : 'Load next rows' }}</VueButton>
        <VueTable
          caption="Suspense table"
          :columns="columns"
          :rows="rows" />
      </div>
    `
  }),
  args: {
    reactTransition: false
  },
  parameters: {
    description: {
      data: 'Expected behavior fixture for loading replacement vs transition-preserved rows.'
    }
  }
};

export const TableWithReactTransition: TableStory = () => ({
  components: {
    VueButton,
    VueTable
  },
  setup() {
    let columns: TableColumn[] = [
      {key: 'name', label: 'Name'},
      {key: 'type', label: 'Type'},
      {key: 'date', label: 'Date Modified'}
    ];
    let rowsA: TableRow[] = [
      {id: 25, name: 'Web Development', date: '7/10/2023', type: 'File folder'},
      {id: 26, name: 'drivers', date: '2/2/2022', type: 'System file'},
      {id: 27, name: 'debug.txt', date: '12/5/2024', type: 'Text document'},
      {id: 28, name: 'Marketing Plan.pptx', date: '3/15/2025', type: 'PowerPoint file'}
    ];
    let rowsB: TableRow[] = [
      {id: 11, name: 'Adobe Premiere Pro', date: '8/12/2023', type: 'Application'},
      {id: 12, name: 'Adobe XD', date: '9/01/2023', type: 'Application'},
      {id: 13, name: 'Plans', date: '4/12/2024', type: 'File folder'},
      {id: 14, name: 'notes.txt', date: '6/30/2024', type: 'Text document'}
    ];
    let showA = ref(true);
    let rows = ref(rowsA);

    let toggleRows = () => {
      showA.value = !showA.value;
      rows.value = showA.value ? rowsA : rowsB;
    };

    return {
      columns,
      rows,
      toggleRows
    };
  },
  template: `
    <div>
      <VueButton @click="toggleRows">Toggle data using useState + startTransition</VueButton>
      <VueTable
        caption="test"
        :columns="columns"
        :rows="rows" />
    </div>
  `
});
