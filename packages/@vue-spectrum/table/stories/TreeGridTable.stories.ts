import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {ref} from 'vue';
import {Table} from '../src';

type StoryArgs = Record<string, unknown>;
type RowItem = {
  children?: RowItem[],
  foo: string,
  id: string,
  bar: string,
  baz: string
};
type OpenKey = string | number;

function normalizeOpenKeys(value: unknown): Set<OpenKey> {
  if (value == null || typeof value === 'string') {
    return new Set();
  }

  let maybeIterable = value as {[Symbol.iterator]?: (() => Iterator<unknown>) | undefined};
  if (typeof maybeIterable[Symbol.iterator] !== 'function') {
    return new Set();
  }

  return new Set(
    Array.from(value as Iterable<unknown>)
      .filter((entry): entry is OpenKey => typeof entry === 'number' || typeof entry === 'string')
  );
}

function normalizeRows(value: unknown): RowItem[] {
  return Array.isArray(value) ? value as RowItem[] : [];
}

const COLUMNS = [
  {key: 'foo', label: 'Foo'},
  {key: 'bar', label: 'Bar'},
  {key: 'baz', label: 'Baz'}
];

const NESTED_ROWS: RowItem[] = [
  {
    id: 'row-1',
    foo: 'Lvl 1 Foo 1',
    bar: 'Lvl 1 Bar 1',
    baz: 'Lvl 1 Baz 1',
    children: [
      {
        id: 'row-1-1',
        foo: 'Lvl 2 Foo 1',
        bar: 'Lvl 2 Bar 1',
        baz: 'Lvl 2 Baz 1',
        children: [
          {
            id: 'row-1-1-1',
            foo: 'Lvl 3 Foo 1',
            bar: 'Lvl 3 Bar 1',
            baz: 'Lvl 3 Baz 1'
          }
        ]
      },
      {
        id: 'row-1-2',
        foo: 'Lvl 2 Foo 2',
        bar: 'Lvl 2 Bar 2',
        baz: 'Lvl 2 Baz 2'
      }
    ]
  }
];

function makeManyRows(count = 5): RowItem[] {
  return Array.from({length: count}).map((_, index) => ({
    id: `many-${index + 1}`,
    foo: `Row ${index + 1} Foo`,
    bar: `Row ${index + 1} Bar`,
    baz: `Row ${index + 1} Baz`,
    children: [
      {
        id: `many-${index + 1}-child`,
        foo: `Row ${index + 1} Child Foo`,
        bar: `Row ${index + 1} Child Bar`,
        baz: `Row ${index + 1} Child Baz`
      }
    ]
  }));
}

const meta: Meta<typeof Table> = {
  title: 'TableView/Expandable rows',
  component: Table,
  excludeStories: [
    'StaticExpandableRowsRender',
    'DynamicExpandableRowsStoryRender',
    'UserSetRowHeaderRender',
    'ManyExpandableRowsStoryRender',
    'EmptyTreeGridStoryRender',
    'LoadingTreeGridStoryRender'
  ],
  args: {
    ariaLabel: 'TableView with static expandable rows',
    columns: COLUMNS,
    openKeys: new Set(['row-1']),
    rowKey: 'id',
    rows: NESTED_ROWS
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

function renderExpandableTable(args: StoryArgs, showButtons = false, startEmpty = false) {
  return {
    components: {Table},
    setup() {
      let rows = ref<RowItem[]>(startEmpty ? [] : normalizeRows(args.rows));
      let openKeys = ref<Set<OpenKey>>(normalizeOpenKeys(args.openKeys));

      let expandAll = () => {
        openKeys.value = new Set(rows.value.map((row) => row.id));
      };
      let collapseAll = () => {
        openKeys.value = new Set();
      };
      let loadRows = () => {
        rows.value = NESTED_ROWS;
        openKeys.value = new Set(['row-1']);
      };

      return {
        args,
        collapseAll,
        expandAll,
        loadRows,
        openKeys,
        rows,
        showButtons
      };
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <div v-if="showButtons" style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" @click="expandAll">Expand all</button>
          <button type="button" @click="collapseAll">Collapse all</button>
          <button type="button" @click="loadRows">Load rows</button>
        </div>
        <Table
          v-bind="args"
          :rows="rows"
          :open-keys="openKeys" />
      </div>
    `
  };
}

export const StaticExpandableRowsRender = (args: StoryArgs) => renderExpandableTable(args);

export const DynamicExpandableRowsStoryRender = (args: StoryArgs) => renderExpandableTable(args, true);

export const UserSetRowHeaderRender = (args: StoryArgs) => renderExpandableTable(args);

export const ManyExpandableRowsStoryRender = (args: StoryArgs) => {
  let rows = Array.isArray(args.rows) ? args.rows : makeManyRows(5);
  return renderExpandableTable({
    ...args,
    rows
  }, true);
};

export const EmptyTreeGridStoryRender = (args: StoryArgs) => renderExpandableTable(args, false, true);

export const LoadingTreeGridStoryRender = (args: StoryArgs) => renderExpandableTable(args, true, true);

export const StaticExpandableRows: Story = {
  render: (args) => StaticExpandableRowsRender(args),
  args: {
    ariaLabel: 'TableView with static expandable rows',
    columns: COLUMNS,
    rows: NESTED_ROWS,
    openKeys: new Set(['row-1']),
    rowKey: 'id'
  },
  name: 'static with expandable rows'
};

export const DynamicExpandableRowsStory: Story = {
  render: (args) => DynamicExpandableRowsStoryRender(args),
  args: {
    ariaLabel: 'TableView with dynamic expandable rows',
    columns: COLUMNS,
    rows: NESTED_ROWS,
    openKeys: new Set(['row-1']),
    rowKey: 'id'
  },
  name: 'dynamic with expandable rows'
};

export const UserSetRowHeader: Story = {
  render: (args) => UserSetRowHeaderRender(args),
  args: {
    ariaLabel: 'TableView with expandable rows and multiple row headers',
    columns: COLUMNS,
    rows: NESTED_ROWS,
    openKeys: new Set(['row-1']),
    rowKey: 'id'
  },
  name: 'multiple user set row headers',
  parameters: {
    description: {
      data: 'Row headers are Bar and Baz column cells, chevron'
    }
  }
};

export const ManyExpandableRowsStory: Story = {
  render: (args) => ManyExpandableRowsStoryRender(args),
  args: {
    ariaLabel: 'TableView with many dynamic expandable rows',
    columns: COLUMNS,
    rows: makeManyRows(5),
    openKeys: new Set(['many-1', 'many-2', 'many-3']),
    rowKey: 'id'
  },
  name: 'many expandable rows'
};

export const EmptyTreeGridStory: Story = {
  render: (args) => EmptyTreeGridStoryRender(args),
  args: {
    ariaLabel: 'TableView with empty state',
    columns: COLUMNS,
    rows: [],
    openKeys: new Set(),
    rowKey: 'id'
  },
  name: 'empty state'
};

export const LoadingTreeGridStory: Story = {
  render: (args) => LoadingTreeGridStoryRender(args),
  args: {
    ariaLabel: 'TableView with loading',
    columns: COLUMNS,
    rows: [],
    openKeys: new Set(),
    rowKey: 'id'
  },
  name: 'isLoading'
};

export const NestedColumnsStory: Story = {
  render: (args) => renderExpandableTable(args),
  args: {
    ariaLabel: 'TableView with nested columns',
    columns: [
      {key: 'foo', label: 'Group 1 / Foo'},
      {key: 'bar', label: 'Group 1 / Bar'},
      {key: 'baz', label: 'Group 2 / Baz'}
    ],
    rows: NESTED_ROWS,
    openKeys: new Set(['row-1']),
    rowKey: 'id'
  },
  name: 'with nested columns'
};

export const ResizableColumnsStory: Story = {
  render: (args) => renderExpandableTable(args),
  args: {
    ariaLabel: 'TableView with resizable columns',
    columns: COLUMNS,
    rows: NESTED_ROWS,
    openKeys: new Set(['row-1']),
    resizableColumns: ['foo', 'bar', 'baz'],
    rowKey: 'id'
  },
  name: 'resizable columns'
};
