import {action} from 'storybook/actions';
import {DropZone} from '../src';
import {ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof DropZone> = {
  title: 'DropZone',
  component: DropZone,
  argTypes: {}
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderDropZone(baseArgs: Record<string, unknown> = {}, includeDraggable = false, includeButton = false) {
  return (args: Record<string, unknown>) => ({
    components: {DropZone},
    setup() {
      let droppedText = ref('');
      let droppedCount = ref(0);

      let onFilesDrop = (files: File[]) => {
        droppedCount.value = files.length;
        action('filesDrop')(files.map((file) => file.name));
      };

      let onTextDrop = (text: string) => {
        droppedText.value = text;
        action('textDrop')(text);
      };

      let onDragStart = (event: DragEvent) => {
        event.dataTransfer?.setData('text/plain', 'Dragged text sample');
      };

      return {
        args,
        baseArgs,
        droppedCount,
        droppedText,
        includeButton,
        includeDraggable,
        onDragStart,
        onFilesDrop,
        onTextDrop
      };
    },
    template: `
      <div style="display: grid; gap: 10px; max-width: 420px;">
        <div
          v-if="includeDraggable"
          draggable="true"
          style="padding: 8px; border: 1px dashed #666; border-radius: 6px; width: fit-content;"
          @dragstart="onDragStart">
          Drag me
        </div>
        <DropZone
          v-bind="args"
          v-bind="baseArgs"
          @files-drop="onFilesDrop"
          @text-drop="onTextDrop">
          <p style="margin: 0;">Drag and drop files here</p>
          <button v-if="includeButton" type="button">Select a file</button>
        </DropZone>
        <div v-if="droppedCount">Files dropped: {{droppedCount}}</div>
        <div v-if="droppedText">Text dropped: {{droppedText}}</div>
      </div>
    `
  });
}

export const withDraggable: Story = {
  render: renderDropZone({}, true)
};

export const customAriaLabel: Story = {
  render: renderDropZone({'aria-label': 'custom label'}, true)
};

export const withButton: Story = {
  render: renderDropZone({}, false, true)
};

export const customBannerMessage: Story = {
  render: renderDropZone({replaceMessage: 'This is a custom message'})
};

export const acceptsMultiple: Story = {
  render: renderDropZone({multiple: true})
};

export const filledDropzone: Story = {
  render: (args) => ({
    components: {DropZone},
    setup() {
      return {args};
    },
    template: '<DropZone v-bind="args"><img alt="a starry sky" src="https://i.imgur.com/DhygPot.jpg" style="max-width: 100%; border-radius: 4px;" /></DropZone>'
  }),
  args: {
    isFilled: true
  }
};
