import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Table} from '../src';

type StoryArgs = Record<string, unknown>;
type TableColumn = {
  align?: 'center' | 'end' | 'start',
  key: string,
  label: string
};
type TableRow = {
  id: number | string,
  [key: string]: unknown
};
type RenderOptions = {
  includeDropTarget?: boolean,
  rows?: TableRow[],
  twoTables?: boolean
};

const COLUMNS: TableColumn[] = [
  {key: 'name', label: 'Name'},
  {key: 'type', label: 'Type'},
  {key: 'owner', label: 'Owner'},
  {key: 'date', label: 'Date modified', align: 'end'}
];

const BASE_ROWS: TableRow[] = [
  {id: 1, name: 'Product brief', type: 'file', owner: 'Adele Vance', date: '2026-02-20'},
  {id: 2, name: 'System tokens', type: 'folder', owner: 'Jody Patterson', date: '2026-02-19'},
  {id: 3, name: 'Prototype states', type: 'file', owner: 'Micah Shaw', date: '2026-02-17'},
  {id: 4, name: 'Design archive', type: 'folder', owner: 'Rae Carr', date: '2026-02-13'}
];

const SECOND_ROWS: TableRow[] = [
  {id: 'a', name: 'Backlog', type: 'folder', owner: 'Team', date: '2026-02-12'},
  {id: 'b', name: 'QA notes', type: 'file', owner: 'Team', date: '2026-02-11'}
];

const meta: Meta<typeof Table> = {
  title: 'TableView/Drag and Drop/Util Handlers',
  component: Table,
  args: {
    ariaLabel: 'Drag and drop util table',
    columns: COLUMNS,
    density: 'regular',
    overflowMode: 'truncate',
    rows: BASE_ROWS,
    selectionMode: 'multiple'
  },
  argTypes: {
    density: {
      control: 'select',
      options: ['compact', 'regular', 'spacious']
    },
    overflowMode: {
      control: 'radio',
      options: ['truncate', 'wrap']
    },
    selectionMode: {
      control: 'radio',
      options: ['none', 'single', 'multiple']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderUtilStory(args: StoryArgs, note: string, options: RenderOptions = {}) {
  let {
    includeDropTarget = false,
    rows = BASE_ROWS,
    twoTables = false
  } = options;
  return {
    components: {Table},
    setup() {
      return {
        args,
        columns: COLUMNS,
        includeDropTarget,
        note,
        rows,
        secondRows: SECOND_ROWS,
        twoTables
      };
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <div>{{note}}</div>
        <div v-if="includeDropTarget" style="border: 1px dashed #9ca3af; border-radius: 6px; padding: 6px 8px; width: 360px;">
          Droppable placeholder
        </div>
        <Table v-bind="args" :columns="columns" :rows="rows" />
        <Table
          v-if="twoTables"
          v-bind="args"
          aria-label="drag and drop util destination table"
          :columns="columns"
          :rows="secondRows" />
      </div>
    `
  };
}

export const DragOutOfTable: Story = {
  render: (args) => renderUtilStory(args, 'drag out of table', {includeDropTarget: true}),
  name: 'drag out of table'
};

export const DragWithinTable: Story = {
  render: (args) => renderUtilStory(args, 'drag within table (reorder)'),
  name: 'drag within table (reorder)'
};

export const DragOntoRow: Story = {
  render: (args) => renderUtilStory(args, 'drop onto row/folder'),
  name: 'drop onto row/folder',
  parameters: {
    description: {
      data: 'Allows dropping on items and folders. Dropping on a item is a no op (action fires still). Dropping external items is also a no op'
    }
  }
};

export const DropOntoRoot: Story = {
  render: (args) => renderUtilStory(args, 'drop onto root', {twoTables: true}),
  name: 'drop onto root',
  parameters: {
    description: {
      data: 'Allows one way dragging from first table to root of second table. Copy and link operations shouldnt remove items from the first table'
    }
  }
};

export const DropBetweenRows: Story = {
  render: (args) => renderUtilStory(args, 'drop between rows', {twoTables: true}),
  name: 'drop between rows',
  parameters: {
    description: {
      data: 'Allows one way dragging from first table to between items of second table. Copy and link operations shouldnt remove items from the first table'
    }
  }
};

export const AllowsDirectoriesAndFilesFromFinder: Story = {
  render: (args) => renderUtilStory(args, 'allows directories and files from finder', {twoTables: true}),
  name: 'allows directories and files from finder',
  parameters: {
    description: {
      data: 'The first table should allow only directory drops (e.g. folders from finder). The second table should allow all drag type drops (directory/files from finder, any drag items).'
    }
  }
};

export const ComplexDragBetweenTables: Story = {
  render: (args) => renderUtilStory(args, 'complex drag between tables', {twoTables: true}),
  name: 'complex drag between tables',
  parameters: {
    description: {
      data: 'The first table should allow dragging and drops into its folder, but disallow reorder operations. External root drops should be placed at the end of the list. The second table should allow all operations and root drops should be placed at the top of the table. Move and copy operations are allowed. The invalid drag item should be able to be dropped in either table if accompanied by other valid drag items.'
    }
  }
};

export const UsingGetDropOperations: Story = {
  render: (args) => renderUtilStory(args, 'using getDropOperations to determine default drop operation', {twoTables: true}),
  name: 'using getDropOperations to determine default drop operation',
  parameters: {
    description: {
      data: 'Dragging from the first to the second table should automatically set a link operation and all other drop operations should be disabled. Dragging from the second to first table should support copy and link operations, with copy being the default.'
    }
  }
};

export const OverrideUtilHandlers: Story = {
  render: (args) => renderUtilStory(args, 'util handlers overridden by onDrop and getDropOperations', {twoTables: true}),
  name: 'util handlers overridden by onDrop and getDropOperations',
  parameters: {
    description: {
      data: 'The first table should be draggable, the second table should only be root droppable. No actions for onRootDrop, onReorder, onItemDrop, or onInsert should appear in the storybook actions panel.'
    }
  }
};
