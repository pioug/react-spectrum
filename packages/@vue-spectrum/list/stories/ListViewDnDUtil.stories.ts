import {action} from 'storybook/actions';
import {ListView} from '../src';
import {Text} from '@vue-spectrum/text';
import Folder from '@spectrum-icons-vue/workflow/Folder';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;

type UtilItem = {
  childCount?: number,
  identifier: string,
  name: string,
  type: 'file' | 'folder' | 'unique_type'
};

const FOLDER_LIST_1: UtilItem[] = [
  {identifier: '1', type: 'file', name: 'Adobe Photoshop'},
  {identifier: '2', type: 'file', name: 'Adobe XD'},
  {identifier: '3', type: 'folder', name: 'Documents', childCount: 0},
  {identifier: '4', type: 'file', name: 'Adobe InDesign'},
  {identifier: '5', type: 'folder', name: 'Utilities', childCount: 0},
  {identifier: '6', type: 'file', name: 'Adobe AfterEffects'}
];

const FOLDER_LIST_2: UtilItem[] = [
  {identifier: '7', type: 'folder', name: 'Pictures', childCount: 0},
  {identifier: '8', type: 'file', name: 'Adobe Fresco'},
  {identifier: '9', type: 'folder', name: 'Apps', childCount: 0},
  {identifier: '10', type: 'file', name: 'Adobe Illustrator'},
  {identifier: '11', type: 'file', name: 'Adobe Lightroom'},
  {identifier: '12', type: 'file', name: 'Adobe Dreamweaver'},
  {identifier: '13', type: 'unique_type', name: 'invalid drag item'}
];

const MANY_ITEMS: UtilItem[] = Array.from({length: 100}, (_, i) => ({
  identifier: `item${i}`,
  type: 'file',
  name: `Item ${i}`
}));

const OVERRIDE_LIST_1: UtilItem[] = [
  {identifier: '1', type: 'file', name: 'Adobe Photoshop'},
  {identifier: '2', type: 'file', name: 'Adobe XD'},
  {identifier: '3', type: 'file', name: 'Adobe InDesign'},
  {identifier: '4', type: 'file', name: 'Adobe AfterEffects'}
];

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

function renderListTemplate(args: StoryArgs, options: {items: UtilItem[], ariaLabel: string, includeDropTarget?: boolean, height?: string}) {
  return {
    components: {Folder, ListView, Text},
    setup() {
      return {
        args,
        items: options.items,
        onAction: action('onAction')
      };
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 8px;">
        <input v-if="${options.includeDropTarget ? 'true' : 'false'}" aria-label="input before" />
        <div
          v-if="${options.includeDropTarget ? 'true' : 'false'}"
          data-testid="drop-target"
          role="region"
          aria-label="Drop target"
          style="width: 300px; height: 240px; border: 2px dashed var(--spectrum-alias-border-color-mid); display: grid; place-items: center;">
          Drop target
        </div>
        <ListView
          v-bind="args"
          :aria-label="'${options.ariaLabel}'"
          width="300px"
          height="${options.height ?? '300px'}"
          selection-mode="multiple"
          :items="items"
          @action="onAction">
          <template #item="{item}">
            <Folder v-if="item.type === 'folder'" class="react-spectrum-ListViewItem-thumbnail" />
            <Text class="react-spectrum-ListViewItem-content">{{ item.name }}</Text>
            <Text v-if="item.type === 'folder'" class="react-spectrum-ListViewItem-description">contains {{ item.childCount || 0 }} dropped item(s)</Text>
          </template>
        </ListView>
      </div>
    `
  };
}

function renderTwoLists(args: StoryArgs, options?: {firstItems?: UtilItem[], secondItems?: UtilItem[]}) {
  return {
    components: {Folder, ListView, Text},
    setup() {
      return {
        args,
        firstItems: options?.firstItems ?? FOLDER_LIST_1,
        secondItems: options?.secondItems ?? FOLDER_LIST_2
      };
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start;">
        <ListView v-bind="args" aria-label="First ListView in drag between list example" width="300px" height="300px" selection-mode="multiple" :items="firstItems">
          <template #item="{item}">
            <Folder v-if="item.type === 'folder'" class="react-spectrum-ListViewItem-thumbnail" />
            <Text class="react-spectrum-ListViewItem-content">{{ item.name }}</Text>
            <Text v-if="item.type === 'folder'" class="react-spectrum-ListViewItem-description">contains {{ item.childCount || 0 }} dropped item(s)</Text>
          </template>
        </ListView>
        <ListView v-bind="args" aria-label="Second ListView in drag between list example" width="300px" height="300px" selection-mode="multiple" :items="secondItems">
          <template #item="{item}">
            <Folder v-if="item.type === 'folder'" class="react-spectrum-ListViewItem-thumbnail" />
            <Text class="react-spectrum-ListViewItem-content">{{ item.name }}</Text>
            <Text v-if="item.type === 'folder'" class="react-spectrum-ListViewItem-description">contains {{ item.childCount || 0 }} dropped item(s)</Text>
          </template>
        </ListView>
      </div>
    `
  };
}

export const DragOut: Story = {
  render: (args) => renderListTemplate(args, {
    ariaLabel: 'Draggable ListView with dnd hook util handlers',
    includeDropTarget: true,
    items: FOLDER_LIST_1
  }),
  name: 'Drag out of list'
};

export const DragWithin: Story = {
  render: (args) => renderListTemplate(args, {
    ariaLabel: 'Reorderable ListView from util handlers',
    items: FOLDER_LIST_1
  }),
  name: 'Drag within list (Reorder}'
};

export const DragWithinMany: Story = {
  render: (args) => renderListTemplate(args, {
    ariaLabel: 'Reorderable ListView from util handlers',
    height: '400px',
    items: MANY_ITEMS
  }),
  name: 'Drag within list with many items'
};

export const DropOntoItem: Story = {
  render: (args) => renderListTemplate(args, {
    ariaLabel: 'Item and folder droppable ListView from dnd hook util handlers',
    items: FOLDER_LIST_1
  }),
  name: 'drop onto item/folder',
  parameters: {
    description: {
      data: 'Allows dropping on items and folders. Dropping on a item is a no op (action fires still). Dropping external items is also a no op'
    }
  }
};

export const DropOntoRoot: Story = {
  render: (args) => renderTwoLists(args),
  name: 'drop onto root',
  parameters: {
    description: {
      data: 'Allows one way dragging from first list to root of second list. Copy and link operations shouldnt remove items from the first list'
    }
  }
};

export const DropBetween: Story = {
  render: (args) => renderTwoLists(args),
  name: 'drop between items',
  parameters: {
    description: {
      data: 'Allows one way dragging from first list to between items of second list. Copy and link operations shouldnt remove items from the first list'
    }
  }
};

export const DirectoryFileDrop: Story = {
  render: (args) => renderTwoLists(args),
  name: 'allows directories and files from finder',
  parameters: {
    description: {
      data: 'The first list should allow only directory drops (e.g. folders from finder). The second list should allow all drag type drops (directory/files from finder, any drag items).'
    }
  }
};

export const Complex: Story = {
  render: (args) => renderTwoLists(args),
  name: 'complex drag between lists',
  parameters: {
    description: {
      data: 'The first list should allow dragging and drops into its folder, but disallow reorder operations. External root drops should be placed at the end of the list. The second list should allow all operations and root drops should be placed at the top of the list. Move and copy operations are allowed. The invalid drag item should be able to be dropped in either list if accompanied by other valid drag items.'
    }
  }
};

export const GetDropOperationDefault: Story = {
  render: (args) => renderTwoLists(args),
  name: 'using getDropOperations to determine default drop operation',
  parameters: {
    description: {
      data: 'Dragging from the first to the second list should automatically set a link operation and all other drop operations should be disabled. Dragging from the second to first list should support copy and link operations, with copy being the default.'
    }
  }
};

export const UtilOverride: Story = {
  render: (args) => renderTwoLists(args, {
    firstItems: OVERRIDE_LIST_1,
    secondItems: FOLDER_LIST_2
  }),
  name: 'util handlers overridden by onDrop and getDropOperations',
  parameters: {
    description: {
      data: 'The first list should be draggable, the second list should only be root droppable. No actions for onRootDrop, onReorder, onItemDrop, or onInsert should appear in the storybook actions panel.'
    }
  }
};
