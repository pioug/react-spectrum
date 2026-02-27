import {useDrag, useDrop, type DropAria} from '@vue-aria/dnd';
import {computed, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type DnDArgs = {
  draggableDisabled?: boolean,
  onAction?: boolean,
  previewOffset?: {
    x: number,
    y: number
  },
  reorderable?: boolean,
  showDialog?: boolean,
  showGrid?: boolean,
  showListbox?: boolean,
  showMultipleTargets?: boolean,
  showNestedTargets?: boolean,
  showToggle?: boolean,
  virtualized?: boolean
};

type DnDItem = {
  id: string,
  label: string,
  type: 'folder' | 'item'
};

const meta = {
  title: 'Drag and Drop'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function createItems(count: number): DnDItem[] {
  return Array.from({length: count}, (_, index) => ({
    id: `item-${index + 1}`,
    label: `Item ${index + 1}`,
    type: index % 2 === 0 ? 'item' : 'folder'
  }));
}

function renderDnD(args: DnDArgs = {}) {
  return {
    setup() {
      let enabled = ref(true);
      let itemCount = args.virtualized ? 50 : 8;
      let listItems = ref(createItems(itemCount));
      let selectedId = ref(listItems.value[0]?.id ?? '');
      let lastDrop = ref('none');
      let lastAction = ref('none');

      let selectedItem = computed(() => {
        return listItems.value.find((item) => item.id === selectedId.value) ?? null;
      });
      let isDragDisabled = computed(() => !enabled.value || Boolean(args.draggableDisabled));
      let dragItems = computed(() => {
        if (!selectedItem.value) {
          return [];
        }

        return [{
          id: selectedItem.value.id,
          type: selectedItem.value.type,
          value: selectedItem.value.label
        }];
      });
      let gridCells = computed(() => listItems.value.slice(0, 9));

      let drag = useDrag({
        dragItems,
        isDisabled: isDragDisabled,
        onDragEnd(operation, items) {
          if (operation === 'cancel') {
            let labels = items.map((item) => String(item.value)).join(', ');
            lastDrop.value = `cancel:${labels || 'none'}`;
          }
        }
      });

      let onDrop = (context: string, operation: string, items: {value: unknown}[]) => {
        let labels = items.map((item) => String(item.value)).join(', ');
        lastDrop.value = `${operation}:${context}:${labels || 'none'}`;
      };

      let primaryDrop = useDrop({
        isDisabled: computed(() => !enabled.value),
        getDropOperation: () => args.reorderable ? 'move' : 'copy',
        onDrop(items, operation) {
          onDrop('primary', operation, items);
          if (args.reorderable && operation === 'move' && selectedItem.value) {
            let sourceIndex = listItems.value.findIndex((item) => item.id === selectedItem.value?.id);
            if (sourceIndex >= 0) {
              let [item] = listItems.value.splice(sourceIndex, 1);
              if (item) {
                listItems.value.push(item);
                selectedId.value = listItems.value[0]?.id ?? '';
              }
            }
          }
        }
      });

      let gridDrop = useDrop({
        isDisabled: computed(() => !enabled.value),
        onDrop(items, operation) {
          onDrop('grid', operation, items);
        }
      });

      let nestedParentDrop = useDrop({
        isDisabled: computed(() => !enabled.value),
        onDrop(items, operation) {
          onDrop('nested-parent', operation, items);
        }
      });
      let nestedChildDrop = useDrop({
        isDisabled: computed(() => !enabled.value),
        onDrop(items, operation) {
          onDrop('nested-child', operation, items);
        }
      });

      let folderDrop = useDrop({
        acceptedDragTypes: ['folder'],
        isDisabled: computed(() => !enabled.value),
        onDrop(items, operation) {
          onDrop('folders', operation, items);
        }
      });
      let itemDrop = useDrop({
        acceptedDragTypes: ['item'],
        isDisabled: computed(() => !enabled.value),
        onDrop(items, operation) {
          onDrop('items', operation, items);
        }
      });

      let dialogDrop = useDrop({
        isDisabled: computed(() => !enabled.value),
        onDrop(items, operation) {
          onDrop('dialog', operation, items);
        }
      });

      let startDrag = () => {
        if (isDragDisabled.value) {
          return;
        }
        drag.startDrag();
      };
      let cancelDrag = () => {
        drag.endDrag('cancel');
      };
      let selectItem = (id: string) => {
        selectedId.value = id;
      };
      let triggerAction = () => {
        lastAction.value = selectedItem.value?.label ?? 'none';
      };

      let enterDropZone = (dropZone: DropAria) => {
        if (!drag.isDragging.value || drag.dragItems.value.length === 0) {
          return;
        }
        dropZone.enter(drag.dragItems.value);
      };
      let leaveDropZone = (dropZone: DropAria) => {
        dropZone.exit();
      };
      let dropInto = (dropZone: DropAria) => {
        if (!drag.isDragging.value || drag.dragItems.value.length === 0) {
          return;
        }

        let entered = dropZone.enter(drag.dragItems.value);
        if (!entered) {
          lastDrop.value = 'cancel:unsupported target';
          drag.endDrag('cancel');
          dropZone.exit();
          return;
        }

        let operation = dropZone.drop(drag.dragItems.value);
        drag.endDrag(operation);
      };

      let previewStyle = computed(() => {
        let x = args.previewOffset?.x ?? 0;
        let y = args.previewOffset?.y ?? 0;
        return {
          border: '1px solid #888',
          padding: '6px 8px',
          transform: `translate(${x}px, ${y}px)`
        };
      });

      return {
        args,
        cancelDrag,
        dialogDrop,
        enabled,
        drag,
        dropInto,
        enterDropZone,
        folderDrop,
        gridCells,
        gridDrop,
        itemDrop,
        isDragDisabled,
        lastAction,
        lastDrop,
        leaveDropZone,
        listItems,
        nestedChildDrop,
        nestedParentDrop,
        previewStyle,
        primaryDrop,
        selectedId,
        selectedItem,
        selectItem,
        startDrag,
        triggerAction
      };
    },
    template: `
      <div class="vs-dnd" style="display: grid; gap: 10px;">
        <label v-if="args.showToggle" style="display: inline-flex; align-items: center; gap: 6px;">
          <input type="checkbox" v-model="enabled" />
          Enabled
        </label>
        <div class="vs-dnd__status" role="status" aria-live="polite">
          Dragging: {{drag.isDragging ? 'true' : 'false'}} | Last drop: {{lastDrop}}
          <template v-if="args.onAction"> | Last action: {{lastAction}}</template>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-start;">
          <div
            v-if="args.showListbox !== false"
            role="listbox"
            aria-label="Draggable list"
            :aria-disabled="isDragDisabled ? 'true' : undefined"
            class="vs-dnd__listbox"
            style="min-width: 180px; max-height: 180px; overflow: auto; border: 1px solid #ccc; padding: 6px;">
            <button
              v-for="item in listItems"
              :key="item.id"
              class="vs-dnd__option"
              type="button"
              role="option"
              :data-type="item.type"
              :aria-selected="selectedId === item.id ? 'true' : 'false'"
              style="display: block; width: 100%; text-align: left; padding: 4px 6px; border: 1px solid #eee; margin-bottom: 4px;"
              @click="selectItem(item.id)">
              {{item.label}}
            </button>
          </div>

          <div style="display: grid; gap: 8px; min-width: 180px;">
            <button
              class="vs-dnd__draggable"
              type="button"
              :aria-grabbed="drag.isDragging ? 'true' : undefined"
              :draggable="isDragDisabled ? undefined : 'true'"
              @pointerdown.prevent="startDrag"
              @pointerup.prevent="cancelDrag">
              Drag selected: {{selectedItem ? selectedItem.label : 'none'}}
            </button>
            <button v-if="args.onAction" type="button" class="vs-dnd__action" @click="triggerAction">
              Trigger action
            </button>
            <div
              class="vs-dnd__dropzone vs-dnd__dropzone--primary"
              v-bind="primaryDrop.dropProps"
              style="border: 1px dashed #888; padding: 8px; min-height: 36px;"
              @pointerenter="enterDropZone(primaryDrop)"
              @pointerleave="leaveDropZone(primaryDrop)"
              @pointerup.prevent="dropInto(primaryDrop)">
              Primary drop target
            </div>
            <div
              v-if="args.showMultipleTargets"
              class="vs-dnd__dropzone vs-dnd__dropzone--folders"
              data-accepts="folder"
              v-bind="folderDrop.dropProps"
              style="border: 1px dashed #888; padding: 8px; min-height: 36px;"
              @pointerenter="enterDropZone(folderDrop)"
              @pointerleave="leaveDropZone(folderDrop)"
              @pointerup.prevent="dropInto(folderDrop)">
              Folder drop target
            </div>
            <div
              v-if="args.showMultipleTargets"
              class="vs-dnd__dropzone vs-dnd__dropzone--items"
              data-accepts="item"
              v-bind="itemDrop.dropProps"
              style="border: 1px dashed #888; padding: 8px; min-height: 36px;"
              @pointerenter="enterDropZone(itemDrop)"
              @pointerleave="leaveDropZone(itemDrop)"
              @pointerup.prevent="dropInto(itemDrop)">
              Item drop target
            </div>
          </div>

          <div
            v-if="args.showGrid"
            class="vs-dnd__grid"
            role="grid"
            aria-label="Droppable grid"
            :data-drop-target="gridDrop.dropProps['data-drop-target']"
            :aria-disabled="gridDrop.dropProps['aria-disabled']"
            style="display: grid; grid-template-columns: repeat(3, minmax(42px, 1fr)); gap: 6px; border: 1px solid #ccc; padding: 6px; min-width: 180px;"
            @pointerenter="enterDropZone(gridDrop)"
            @pointerleave="leaveDropZone(gridDrop)"
            @pointerup.prevent="dropInto(gridDrop)">
            <div
              v-for="cell in gridCells"
              :key="cell.id"
              role="gridcell"
              style="border: 1px solid #eee; min-height: 42px; display: flex; align-items: center; justify-content: center;">
              {{cell.label}}
            </div>
          </div>

          <div
            v-if="args.showNestedTargets"
            class="vs-dnd__dropzone vs-dnd__dropzone--nested-parent"
            v-bind="nestedParentDrop.dropProps"
            style="border: 1px dashed #888; padding: 8px; min-width: 180px;"
            @pointerenter="enterDropZone(nestedParentDrop)"
            @pointerleave="leaveDropZone(nestedParentDrop)"
            @pointerup.prevent="dropInto(nestedParentDrop)">
            Parent drop target
            <div
              class="vs-dnd__dropzone vs-dnd__dropzone--nested-child"
              v-bind="nestedChildDrop.dropProps"
              style="border: 1px dashed #888; margin-top: 8px; padding: 8px;"
              @pointerenter.stop="enterDropZone(nestedChildDrop)"
              @pointerleave.stop="leaveDropZone(nestedChildDrop)"
              @pointerup.stop.prevent="dropInto(nestedChildDrop)">
              Child drop target
            </div>
          </div>
        </div>

        <div
          v-if="args.showDialog"
          role="dialog"
          aria-label="Drag and drop dialog"
          style="border: 1px solid #bbb; padding: 8px;">
          <strong>Dialog</strong>
          <div
            class="vs-dnd__dropzone vs-dnd__dropzone--dialog"
            v-bind="dialogDrop.dropProps"
            style="border: 1px dashed #888; margin-top: 8px; padding: 8px;"
            @pointerenter="enterDropZone(dialogDrop)"
            @pointerleave="leaveDropZone(dialogDrop)"
            @pointerup.prevent="dropInto(dialogDrop)">
            Dialog drop target
          </div>
        </div>

        <div v-if="drag.isDragging" class="vs-dnd__preview" :style="previewStyle">
          Preview: {{selectedItem ? selectedItem.label : 'none'}}
        </div>
      </div>
    `
  };
}

export const Default: Story = {
  render: () => renderDnD(),
  name: 'Default'
};

export const DraggableStory: Story = {
  render: () => renderDnD(),
  name: 'Draggable'
};

export const DraggableDisabled: Story = {
  render: () => renderDnD({draggableDisabled: true}),
  name: 'Draggable isDisabled'
};

export const DraggableEnabledDisabledControl: Story = {
  render: () => renderDnD({showToggle: true}),
  name: 'Draggable Enable/Disable control'
};

export const DroppableStory: Story = {
  render: () => renderDnD(),
  name: 'Droppable'
};

export const DroppableEnabledDisabledControl: Story = {
  render: () => renderDnD({showToggle: true}),
  name: 'Droppable Enable/Disable control'
};

export const DraggableListbox: Story = {
  render: () => renderDnD({showListbox: true}),
  name: 'Draggable listbox'
};

export const DraggableListboxOnAction: Story = {
  render: () => renderDnD({onAction: true, showListbox: true}),
  name: 'Draggable listbox, onAction'
};

export const DroppableListbox: Story = {
  render: () => renderDnD({showListbox: true}),
  name: 'Droppable listbox'
};

export const DroppableGrid: Story = {
  render: () => renderDnD({showGrid: true}),
  name: 'Droppable grid'
};

export const DroppableGridWithManyItems: Story = {
  render: () => renderDnD({showGrid: true, virtualized: true}),
  name: 'Droppable grid with many items'
};

export const DraggableGridDroppableListbox: Story = {
  render: () => renderDnD({showGrid: true, showListbox: true}),
  name: 'Draggable grid, droppable listbox'
};

export const Reorderable: Story = {
  render: () => renderDnD({reorderable: true}),
  name: 'Reorderable'
};

export const CollectionPreviewOffset: Story = {
  render: () => renderDnD({previewOffset: {x: 16, y: 8}}),
  name: 'Collection preview offset'
};

export const PreviewOffset: Story = {
  render: () => renderDnD({previewOffset: {x: 32, y: 16}}),
  name: 'Preview offset'
};

export const MultipleCollectionDropTargets: Story = {
  render: () => renderDnD({showMultipleTargets: true}),
  name: 'Multiple collection drop targets'
};

export const VirtualizedListbox: Story = {
  render: () => renderDnD({virtualized: true}),
  name: 'Virtualized listbox'
};

export const NestedDropRegions: Story = {
  render: () => renderDnD({showNestedTargets: true, showListbox: true}),
  name: 'nested drop regions'
};

export const InDialog: Story = {
  render: () => renderDnD({showDialog: true}),
  name: 'In dialog'
};
