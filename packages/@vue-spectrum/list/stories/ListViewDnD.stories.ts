import {action} from 'storybook/actions';
import {ActionMenu} from '@vue-spectrum/menu';
import {ListView} from '../src';
import {Text} from '@vue-spectrum/text';
import Delete from '@spectrum-icons-vue/workflow/Delete';
import Edit from '@spectrum-icons-vue/workflow/Edit';
import FileData from '@spectrum-icons-vue/workflow/FileData';
import Folder from '@spectrum-icons-vue/workflow/Folder';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;

type DnDItem = {
  description?: string,
  key: string,
  name: string,
  type?: 'folder' | 'item'
};

const BASE_ITEMS: DnDItem[] = [
  {key: 'a', name: 'Adobe Photoshop', type: 'item'},
  {key: 'b', name: 'Adobe XD', type: 'item', description: 'Beta'},
  {key: 'c', name: 'Documents', type: 'folder'},
  {key: 'd', name: 'Adobe InDesign', type: 'item'},
  {key: 'e', name: 'Utilities', type: 'folder'},
  {key: 'f', name: 'Adobe AfterEffects', type: 'item'},
  {key: 'g', name: 'Adobe Illustrator', type: 'item'},
  {key: 'h', name: 'Adobe Lightroom', type: 'item'},
  {key: 'i', name: 'Adobe Premiere Pro', type: 'item'},
  {key: 'j', name: 'Adobe Fresco', type: 'item'},
  {key: 'k', name: 'Adobe Dreamweaver', type: 'item'},
  {key: 'l', name: 'Adobe Connect', type: 'item'},
  {key: 'm', name: 'Pictures', type: 'folder'},
  {key: 'n', name: 'Adobe Acrobat', type: 'item'}
];

const REORDER_ITEMS_1: DnDItem[] = [
  {key: '1', name: 'Item One'},
  {key: '2', name: 'Item Two'},
  {key: '3', name: 'Item Three'},
  {key: '4', name: 'Item Four'},
  {key: '5', name: 'Item Five'},
  {key: '6', name: 'Item Six'}
];

const REORDER_ITEMS_2: DnDItem[] = [
  {key: '7', name: 'Item Seven'},
  {key: '8', name: 'Item Eight'},
  {key: '9', name: 'Item Nine'},
  {key: '10', name: 'Item Ten'},
  {key: '11', name: 'Item Eleven'},
  {key: '12', name: 'Item Twelve'}
];

const DRAG_INTO_ITEMS: DnDItem[] = [
  {key: '0', name: 'Folder 1', type: 'folder', description: 'contains 0 dropped item(s)'},
  {key: '1', name: 'Item One', type: 'item'},
  {key: '2', name: 'Item Two', type: 'item'},
  {key: '3', name: 'Item Three', type: 'item'},
  {key: '4', name: 'Item Four', type: 'item'},
  {key: '5', name: 'Item Five', type: 'item'},
  {key: '6', name: 'Item Six', type: 'item'},
  {key: '7', name: 'Folder disabled', type: 'folder', description: 'contains 0 dropped item(s)'},
  {key: '8', name: 'Folder 2', type: 'folder', description: 'contains 0 dropped item(s)'}
];

const MANY_ITEMS: DnDItem[] = Array.from({length: 100}, (_, i) => ({
  key: `item-${i}`,
  name: `Item ${i}`,
  type: 'item'
}));

const ACTION_MENU_ITEMS = [
  {key: 'edit', label: 'Edit'},
  {key: 'delete', label: 'Delete'}
];

const meta: Meta<typeof ListView> = {
  title: 'ListView/Drag and Drop',
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

function renderDraggableRows(args: StoryArgs) {
  return {
    components: {ActionMenu, Delete, Edit, FileData, Folder, ListView, Text},
    setup() {
      return {
        actionItems: ACTION_MENU_ITEMS,
        args,
        items: BASE_ITEMS,
        onMenuAction: action('onAction')
      };
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0;">
        <input aria-label="input before" />
        <div
          data-testid="drop-target"
          role="region"
          aria-label="Drop target"
          style="width: 300px; height: 240px; margin: 0 0 0 2px; border: 2px dashed var(--spectrum-alias-border-color-mid); display: grid; place-items: center; color: var(--spectrum-global-color-gray-900);">
          Drop target
        </div>
        <ListView
          v-bind="args"
          aria-label="draggable list view"
          width="300px"
          selection-mode="multiple"
          :disabled-keys="['f']"
          :items="items">
          <template #item="{item}">
            <Folder v-if="item.type === 'folder'" class="react-spectrum-ListViewItem-thumbnail" />
            <FileData v-else-if="item.key === 'a'" class="react-spectrum-ListViewItem-thumbnail" />
            <Text class="react-spectrum-ListViewItem-content">{{ item.name }}</Text>
            <Text v-if="item.description" class="react-spectrum-ListViewItem-description">{{ item.description }}</Text>
            <div class="react-spectrum-ListViewItem-actionmenu">
              <ActionMenu :items="actionItems" @action="onMenuAction" />
            </div>
          </template>
        </ListView>
      </div>
    `
  };
}

function renderReorderList(args: StoryArgs, options: {height?: number, items?: DnDItem[]}) {
  return {
    components: {ListView, Text},
    setup() {
      return {
        args,
        items: options.items ?? REORDER_ITEMS_1
      };
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; align-items: center; height: ${options.height ? `${options.height}px` : 'auto'};">
        <ListView
          v-bind="args"
          aria-label="reorderable list view"
          width="300px"
          height="100%"
          selection-mode="multiple"
          :disabled-keys="['2']"
          :items="items">
          <template #item="{item}">
            <Text class="react-spectrum-ListViewItem-content">{{ item.name }}</Text>
          </template>
        </ListView>
      </div>
    `
  };
}

function renderTwoLists(args: StoryArgs) {
  return {
    components: {ListView, Text},
    setup() {
      return {
        args,
        items1: REORDER_ITEMS_1,
        items2: REORDER_ITEMS_2
      };
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start;">
        <div style="display: grid; gap: 4px; margin: 4px;">
          <Text style="text-align: center;">List 1</Text>
          <ListView v-bind="args" aria-label="First list view" width="300px" selection-mode="multiple" :disabled-keys="['2']" :items="items1">
            <template #item="{item}">
              <Text class="react-spectrum-ListViewItem-content">{{ item.name }}</Text>
            </template>
          </ListView>
        </div>
        <div style="display: grid; gap: 4px; margin: 4px;">
          <Text style="text-align: center;">List 2</Text>
          <ListView v-bind="args" aria-label="Second list view" width="300px" selection-mode="multiple" :disabled-keys="['2']" :items="items2">
            <template #item="{item}">
              <Text class="react-spectrum-ListViewItem-content">{{ item.name }}</Text>
            </template>
          </ListView>
        </div>
      </div>
    `
  };
}

export const DragOut: Story = {
  render: (args) => renderDraggableRows(args),
  name: 'Drag out of list'
};

export const CustomDragPreview: Story = {
  render: (args) => renderDraggableRows(args),
  name: 'Custom drag preview'
};

export const DragWithin: Story = {
  render: (args) => renderReorderList(args, {}),
  name: 'Drag within list (Reorder}'
};

export const DragWithinScroll: Story = {
  render: (args) => renderReorderList(args, {height: 100}),
  name: 'Drag within list scrolling (Reorder)'
};

export const DragWithinMany: Story = {
  render: (args) => renderReorderList(args, {height: 400, items: MANY_ITEMS}),
  name: 'Drag within list with many items'
};

export const DragIntoFolder: Story = {
  render: (args) => ({
    components: {Folder, ListView, Text},
    setup() {
      return {
        args,
        items: DRAG_INTO_ITEMS
      };
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; align-items: center;">
        <ListView
          v-bind="args"
          aria-label="Drop into list view item example"
          width="300px"
          selection-mode="multiple"
          :disabled-keys="['2', '7']"
          :items="items">
          <template #item="{item}">
            <Folder v-if="item.type === 'folder'" class="react-spectrum-ListViewItem-thumbnail" />
            <Text class="react-spectrum-ListViewItem-content">{{ item.type === 'folder' ? item.name + ' (Drop items here)' : item.name }}</Text>
            <Text v-if="item.description" class="react-spectrum-ListViewItem-description">{{ item.description }}</Text>
          </template>
        </ListView>
      </div>
    `
  }),
  name: 'Drag into folder'
};

export const DragBetween: Story = {
  render: (args) => renderTwoLists(args),
  name: 'Drag between lists'
};

export const DragBetweenRootOnly: Story = {
  render: (args) => renderTwoLists(args),
  name: 'Drag between lists (Root only)',
  parameters: {
    description: {
      data: 'Folders are non-draggable.'
    }
  }
};

export const DraggableOnAction: Story = {
  render: (args) => renderDraggableRows(args),
  name: 'draggable rows, onAction',
  parameters: {
    description: {
      data: 'Folders are non-draggable.'
    }
  }
};

export const DraggableCopyLink: Story = {
  render: (args) => renderDraggableRows(args),
  name: 'draggable rows, allow copy and link',
  parameters: {
    description: {
      data: 'Allows copy, link, and cancel operations. Copy should be the default operation, and link should be the operation when the CTRL key is held while dragging.'
    }
  }
};
