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
  manyHeight?: number,
  twoLists?: boolean
};
type StoryArgs = Record<string, unknown>;

const BASE_ITEMS: ListViewItem[] = [
  {id: '1', label: 'Figma files', type: 'folder'},
  {id: '2', label: 'Photoshop mockup', type: 'item'},
  {id: '3', label: 'Illustrator assets', type: 'item'},
  {id: '4', label: 'XD archive', type: 'item'}
];

const SECOND_LIST_ITEMS: ListViewItem[] = [
  {id: 'a', label: 'Archive', type: 'folder'},
  {id: 'b', label: 'Marketing deck', type: 'item'},
  {id: 'c', label: 'Design tokens', type: 'item'}
];

const MANY_ITEMS: ListViewItem[] = Array.from({length: 100}, (_, index) => ({
  id: `item-${index}`,
  label: `Item ${index}`,
  type: 'item'
}));

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

function renderDnDStory(args: StoryArgs, options: RenderOptions = {}) {
  let {
    includeDropTarget = false,
    items = BASE_ITEMS,
    manyHeight,
    twoLists = false
  } = options;
  return {
    components: {ListView},
    setup() {
      return {
        args,
        includeDropTarget,
        items,
        manyHeight,
        secondItems: SECOND_LIST_ITEMS,
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
        <div :style="{maxHeight: manyHeight ? manyHeight + 'px' : undefined, overflowY: manyHeight ? 'auto' : undefined}">
          <ListView v-bind="args" aria-label="drag and drop list" :items="items" />
        </div>
        <ListView
          v-if="twoLists"
          v-bind="args"
          aria-label="drag and drop list destination"
          :items="secondItems" />
      </div>
    `
  };
}

export const DragOut: Story = {
  render: (args) => renderDnDStory(args, {includeDropTarget: true}),
  name: 'Drag out of list'
};

export const CustomDragPreview: Story = {
  render: (args) => renderDnDStory(args, {includeDropTarget: true}),
  name: 'Custom drag preview'
};

export const DragWithin: Story = {
  render: (args) => renderDnDStory(args),
  name: 'Drag within list (Reorder}'
};

export const DragWithinScroll: Story = {
  render: (args) => renderDnDStory(args, {manyHeight: 120}),
  name: 'Drag within list scrolling (Reorder)'
};

export const DragWithinMany: Story = {
  render: (args) => renderDnDStory(args, {items: MANY_ITEMS, manyHeight: 280}),
  name: 'Drag within list with many items'
};

export const DragIntoFolder: Story = {
  render: (args) => renderDnDStory(args),
  name: 'Drag into folder'
};

export const DragBetween: Story = {
  render: (args) => renderDnDStory(args, {twoLists: true}),
  name: 'Drag between lists'
};

export const DragBetweenRootOnly: Story = {
  render: (args) => renderDnDStory(args, {twoLists: true}),
  name: 'Drag between lists (Root only)',
  parameters: {
    description: {
      data: 'Folders are non-draggable.'
    }
  }
};

export const DraggableOnAction: Story = {
  render: (args) => renderDnDStory(args, {includeDropTarget: true}),
  name: 'draggable rows, onAction',
  parameters: {
    description: {
      data: 'Folders are non-draggable.'
    }
  }
};

export const DraggableCopyLink: Story = {
  render: (args) => renderDnDStory(args, {includeDropTarget: true}),
  name: 'draggable rows, allow copy and link',
  parameters: {
    description: {
      data: 'Allows copy, link, and cancel operations. Copy should be the default operation, and link should be the operation when the CTRL key is held while dragging.'
    }
  }
};
