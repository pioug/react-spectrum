import {action} from '@storybook/addon-actions';
import {DropZone} from '../src';
import {ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof DropZone> = {
  title: 'DropZone',
  component: DropZone,
  args: {
    label: 'Example'
  },
  argTypes: {
    accept: {
      control: 'text'
    },
    disabled: {
      control: 'boolean'
    },
    isFilled: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    multiple: {
      control: 'boolean'
    },
    replaceMessage: {
      control: 'text'
    }
  }
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

export const WithDraggable: Story = {
  render: renderDropZone({}, true),
  name: 'With Draggable'
};

export const CustomAriaLabel: Story = {
  render: renderDropZone({'aria-label': 'custom label'}, true),
  name: 'Custom Aria Label'
};

export const WithButton: Story = {
  render: renderDropZone({}, false, true),
  name: 'With Button'
};

export const CustomBannerMessage: Story = {
  render: renderDropZone({replaceMessage: 'This is a custom message'}),
  name: 'Custom Banner Message'
};

export const AcceptsMultiple: Story = {
  render: renderDropZone({multiple: true}),
  name: 'Accepts Multiple'
};

export const FilledDropzone: Story = {
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
