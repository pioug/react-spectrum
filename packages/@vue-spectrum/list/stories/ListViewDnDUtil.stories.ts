import {ListView} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type ListViewItem = {
  id: string,
  label: string,
  type?: 'folder' | 'item'
};
type RenderOptions = {
  includeDropTarget?: boolean,
  items?: ListViewItem[],
  twoLists?: boolean
};
type StoryArgs = Record<string, unknown>;

const BASE_ITEMS: ListViewItem[] = [
  {id: '1', label: 'Folder 1', type: 'folder'},
  {id: '2', label: 'File 1', type: 'item'},
  {id: '3', label: 'File 2', type: 'item'}
];

const SECOND_ITEMS: ListViewItem[] = [
  {id: 'a', label: 'Inbox', type: 'folder'},
  {id: 'b', label: 'Shared PSD', type: 'item'},
  {id: 'c', label: 'Sprint notes', type: 'item'}
];

const MANY_ITEMS: ListViewItem[] = Array.from({length: 100}, (_, index) => ({
  id: `item-${index}`,
  label: `Item ${index}`,
  type: 'item'
}));

const meta: Meta<typeof ListView> = {
  title: 'ListView/Drag and Drop/Util Handlers',
  component: ListView,
  args: {
    density: 'regular',
    disabledBehavior: 'selection',
    isQuiet: false,
    overflowMode: 'truncate',
    selectionMode: 'multiple',
    selectionStyle: 'checkbox'
  },
  argTypes: {
    density: {
      control: 'select',
      options: ['compact', 'regular', 'spacious']
    },
    disabledBehavior: {
      control: 'radio',
      options: ['selection', 'all']
    },
    isQuiet: {
      control: 'boolean'
    },
    overflowMode: {
      control: 'radio',
      options: ['truncate', 'wrap']
    },
    selectionMode: {
      control: 'radio',
      options: ['none', 'single', 'multiple']
    },
    selectionStyle: {
      control: 'radio',
      options: ['checkbox', 'highlight']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderUtilStory(args: StoryArgs, options: RenderOptions = {}) {
  let {
    includeDropTarget = false,
    items = BASE_ITEMS,
    twoLists = false
  } = options;
  return {
    components: {ListView},
    setup() {
      return {
        args,
        includeDropTarget,
        items,
        secondItems: SECOND_ITEMS,
        twoLists
      };
    },
    template: `
      <div style="display: grid; gap: 8px; width: 320px;">
        <div
          v-if="includeDropTarget"
          role="region"
          aria-label="Drop target"
          data-testid="drop-target"
          style="border: 1px dashed #9ca3af; border-radius: 6px; padding: 6px 8px;">
          Drop target
        </div>
        <ListView v-bind="args" aria-label="util handlers list" :items="items" />
        <ListView
          v-if="twoLists"
          v-bind="args"
          aria-label="util handlers destination list"
          :items="secondItems" />
      </div>
    `
  };
}

export const DragOut: Story = {
  render: (args) => renderUtilStory(args, {includeDropTarget: true}),
  name: 'Drag out of list'
};

export const DragWithin: Story = {
  render: (args) => renderUtilStory(args),
  name: 'Drag within list (Reorder}'
};

export const DragWithinMany: Story = {
  render: (args) => renderUtilStory(args, {items: MANY_ITEMS}),
  name: 'Drag within list with many items'
};

export const DropOntoItem: Story = {
  render: (args) => renderUtilStory(args),
  name: 'drop onto item/folder',
  parameters: {
    description: {
      data: 'Allows dropping on items and folders. Dropping on a item is a no op (action fires still). Dropping external items is also a no op'
    }
  }
};

export const DropOntoRoot: Story = {
  render: (args) => renderUtilStory(args, {twoLists: true}),
  name: 'drop onto root',
  parameters: {
    description: {
      data: 'Allows one way dragging from first list to root of second list. Copy and link operations shouldnt remove items from the first list'
    }
  }
};

export const DropBetween: Story = {
  render: (args) => renderUtilStory(args, {twoLists: true}),
  name: 'drop between items',
  parameters: {
    description: {
      data: 'Allows one way dragging from first list to between items of second list. Copy and link operations shouldnt remove items from the first list'
    }
  }
};

export const DirectoryFileDrop: Story = {
  render: (args) => renderUtilStory(args, {twoLists: true}),
  name: 'allows directories and files from finder',
  parameters: {
    description: {
      data: 'The first list should allow only directory drops (e.g. folders from finder). The second list should allow all drag type drops (directory/files from finder, any drag items).'
    }
  }
};

export const Complex: Story = {
  render: (args) => renderUtilStory(args, {twoLists: true}),
  name: 'complex drag between lists',
  parameters: {
    description: {
      data: 'The first list should allow dragging and drops into its folder, but disallow reorder operations. External root drops should be placed at the end of the list. The second list should allow all operations and root drops should be placed at the top of the list. Move and copy operations are allowed. The invalid drag item should be able to be dropped in either list if accompanied by other valid drag items.'
    }
  }
};

export const GetDropOperationDefault: Story = {
  render: (args) => renderUtilStory(args, {twoLists: true}),
  name: 'using getDropOperations to determine default drop operation',
  parameters: {
    description: {
      data: 'Dragging from the first to the second list should automatically set a link operation and all other drop operations should be disabled. Dragging from the second to first list should support copy and link operations, with copy being the default.'
    }
  }
};

export const UtilOverride: Story = {
  render: (args) => renderUtilStory(args, {twoLists: true}),
  name: 'util handlers overridden by onDrop and getDropOperations',
  parameters: {
    description: {
      data: 'The first list should be draggable, the second list should only be root droppable. No actions for onRootDrop, onReorder, onItemDrop, or onInsert should appear in the storybook actions panel.'
    }
  }
};
