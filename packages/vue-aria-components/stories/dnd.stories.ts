import {computed, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type DnDArgs = {
  description?: string,
  showDialog?: boolean,
  showGrid?: boolean,
  showListbox?: boolean,
  showToggle?: boolean,
  virtualized?: boolean
};

const meta = {
  title: 'Drag and Drop'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function renderDnD(args: DnDArgs = {}) {
  return {
    setup() {
      let enabled = ref(true);
      let listItems = computed(() => {
        let count = args.virtualized ? 50 : 8;
        return Array.from({length: count}, (_, index) => `Item ${index + 1}`);
      });
      let gridItems = computed(() => Array.from({length: 9}, (_, index) => `Cell ${index + 1}`));

      return {
        args,
        enabled,
        gridItems,
        listItems
      };
    },
    template: `
      <div style="display: grid; gap: 10px;">
        <p v-if="args.description" style="margin: 0;">{{args.description}}</p>
        <label v-if="args.showToggle" style="display: inline-flex; align-items: center; gap: 6px;">
          <input type="checkbox" v-model="enabled" />
          Enabled
        </label>
        <div v-if="args.showDialog" role="dialog" aria-label="dialog container" style="border: 1px solid #bbb; padding: 8px;">
          Dialog shell
        </div>
        <div style="display: flex; gap: 12px;">
          <div
            v-if="args.showListbox !== false"
            role="listbox"
            :aria-disabled="enabled ? undefined : 'true'"
            style="min-width: 180px; max-height: 180px; overflow: auto; border: 1px solid #ccc; padding: 6px;">
            <div
              v-for="item in listItems"
              :key="item"
              draggable="true"
              style="padding: 4px 6px; border: 1px solid #eee; margin-bottom: 4px;">
              {{item}}
            </div>
          </div>
          <div
            v-if="args.showGrid"
            role="grid"
            :aria-disabled="enabled ? undefined : 'true'"
            style="display: grid; grid-template-columns: repeat(3, minmax(42px, 1fr)); gap: 6px; border: 1px solid #ccc; padding: 6px; min-width: 180px;">
            <div
              v-for="cell in gridItems"
              :key="cell"
              role="gridcell"
              draggable="true"
              style="border: 1px solid #eee; min-height: 42px; display: flex; align-items: center; justify-content: center;">
              {{cell}}
            </div>
          </div>
        </div>
      </div>
    `
  };
}

export const Default: Story = {
  render: () => renderDnD({description: 'Default drag and drop playground.'}),
  name: 'Default'
};

export const DraggableStory: Story = {
  render: () => renderDnD({description: 'Draggable elements enabled.'}),
  name: 'Draggable'
};

export const DraggableDisabled: Story = {
  render: () => renderDnD({description: 'Draggable isDisabled state.', showToggle: true}),
  name: 'Draggable isDisabled'
};

export const DraggableEnabledDisabledControl: Story = {
  render: () => renderDnD({description: 'Toggle draggable state.', showToggle: true}),
  name: 'Draggable Enable/Disable control'
};

export const DroppableStory: Story = {
  render: () => renderDnD({description: 'Droppable target regions.'}),
  name: 'Droppable'
};

export const DroppableEnabledDisabledControl: Story = {
  render: () => renderDnD({description: 'Toggle droppable state.', showToggle: true}),
  name: 'Droppable Enable/Disable control'
};

export const DraggableListbox: Story = {
  render: () => renderDnD({description: 'Draggable listbox example.', showListbox: true}),
  name: 'Draggable listbox'
};

export const DraggableListboxOnAction: Story = {
  render: () => renderDnD({description: 'Draggable listbox with onAction.'}),
  name: 'Draggable listbox, onAction'
};

export const DroppableListbox: Story = {
  render: () => renderDnD({description: 'Droppable listbox target.'}),
  name: 'Droppable listbox'
};

export const DroppableGrid: Story = {
  render: () => renderDnD({description: 'Droppable grid target.', showGrid: true}),
  name: 'Droppable grid'
};

export const DroppableGridWithManyItems: Story = {
  render: () => renderDnD({description: 'Droppable grid with many items.', showGrid: true, virtualized: true}),
  name: 'Droppable grid with many items'
};

export const DraggableGridDroppableListbox: Story = {
  render: () => renderDnD({description: 'Draggable grid and droppable listbox.', showGrid: true, showListbox: true}),
  name: 'Draggable grid, droppable listbox'
};

export const Reorderable: Story = {
  render: () => renderDnD({description: 'Reorderable collection behavior.'}),
  name: 'Reorderable'
};

export const CollectionPreviewOffset: Story = {
  render: () => renderDnD({description: 'Collection preview offset scenario.'}),
  name: 'Collection preview offset'
};

export const PreviewOffset: Story = {
  render: () => renderDnD({description: 'Preview offset scenario.'}),
  name: 'Preview offset'
};

export const MultipleCollectionDropTargets: Story = {
  render: () => renderDnD({description: 'Multiple collection drop targets.', showGrid: true}),
  name: 'Multiple collection drop targets'
};

export const VirtualizedListbox: Story = {
  render: () => renderDnD({description: 'Virtualized listbox drag and drop.', virtualized: true}),
  name: 'Virtualized listbox'
};

export const NestedDropRegions: Story = {
  render: () => renderDnD({description: 'Nested drop regions visual.', showGrid: true, showListbox: true}),
  name: 'nested drop regions'
};

export const InDialog: Story = {
  render: () => renderDnD({description: 'Drag and drop inside dialog.', showDialog: true}),
  name: 'In dialog'
};
