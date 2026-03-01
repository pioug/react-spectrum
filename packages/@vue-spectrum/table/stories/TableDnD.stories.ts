import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Table} from '../src';
import defaultConfig from './Table.stories';

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
  {id: 1, name: 'Design folder', type: 'folder', owner: 'Adele Vance', date: '2026-02-20'},
  {id: 2, name: 'Brand lockup.ai', type: 'file', owner: 'Jody Patterson', date: '2026-02-18'},
  {id: 3, name: 'Quarterly summary', type: 'file', owner: 'Micah Shaw', date: '2026-02-16'},
  {id: 4, name: 'Launch assets', type: 'folder', owner: 'Rae Carr', date: '2026-02-14'}
];

const SECOND_ROWS: TableRow[] = [
  {id: 'a', name: 'Archive', type: 'folder', owner: 'Team', date: '2026-01-31'},
  {id: 'b', name: 'Roadmap.pdf', type: 'file', owner: 'Team', date: '2026-02-01'}
];

const MANY_ROWS: TableRow[] = Array.from({length: 100}, (_, index) => ({
  id: index + 1,
  name: `Item ${index + 1}`,
  type: index % 5 === 0 ? 'folder' : 'file',
  owner: `Owner ${index % 8}`,
  date: `2026-02-${String((index % 27) + 1).padStart(2, '0')}`
}));

const meta: Meta<typeof Table> = {
  ...defaultConfig,
  title: 'TableView/Drag and Drop',
  component: Table,
  args: {
    ...defaultConfig.args,
    ariaLabel: 'Drag and drop table',
    columns: COLUMNS,
    rowKey: 'id',
    rows: BASE_ROWS,
    width: 700,
    height: 500
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderTableDnD(args: StoryArgs, options: RenderOptions = {}) {
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
        rows,
        secondRows: SECOND_ROWS,
        twoTables
      };
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <div
          v-if="includeDropTarget"
          role="region"
          aria-label="Drop target"
          data-testid="drop-target"
          style="border: 1px dashed #9ca3af; border-radius: 6px; padding: 6px 8px; width: 360px;">
          Drop target
        </div>
        <Table v-bind="args" :columns="columns" :rows="rows" />
        <Table
          v-if="twoTables"
          v-bind="args"
          aria-label="drag and drop destination table"
          :columns="columns"
          :rows="secondRows" />
      </div>
    `
  };
}

export const DragOutOfTable: Story = {
  render: (args) => renderTableDnD(args, {includeDropTarget: true}),
  name: 'Drag out of table'
};

export const DragOutOfTableWithoutTableHeader: Story = {
  render: (args) => renderTableDnD(args, {includeDropTarget: true}),
  name: 'Drag out of table without table header'
};

export const CustomDragPreview: Story = {
  render: (args) => renderTableDnD(args, {includeDropTarget: true}),
  name: 'Custom drag preview'
};

export const DragWithinTable: Story = {
  render: (args) => renderTableDnD(args),
  name: 'Drag within table (Reorder)'
};

export const DragWithinTableManyItems: Story = {
  render: (args) => renderTableDnD(args, {rows: MANY_ROWS}),
  name: 'Drag within table many items'
};

export const DragOntoRow: Story = {
  render: (args) => renderTableDnD(args),
  name: 'Drag onto row',
  parameters: {
    description: {
      data: 'Drag item types onto folder types.'
    }
  }
};

export const DragBetweenTables: Story = {
  render: (args) => renderTableDnD(args, {twoTables: true}),
  name: 'Drag between tables'
};

export const DragBetweenTablesRootOnly: Story = {
  render: (args) => renderTableDnD(args, {twoTables: true}),
  name: 'Drag between tables (Root only)'
};

export const DraggableRowsCopyLink: Story = {
  render: (args) => renderTableDnD(args, {includeDropTarget: true}),
  name: 'draggable rows, allow copy and link',
  parameters: {
    description: {
      data: 'Allows copy, link, and cancel operations. Copy should be the default operation, and link should be the operation when the CTRL key is held while dragging.'
    }
  }
};
