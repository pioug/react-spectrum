import {action} from '@storybook/addon-actions';
import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VueDropZone, VueFileTrigger} from '@vue-spectrum/components';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/Dropzone',
  component: VueDropZone
} satisfies Meta<typeof VueDropZone>;

export default meta;

type Story = StoryObj<typeof meta>;

function useDropActions() {
  return {
    onDrop: action('OnDrop'),
    onDropEnter: action('OnDropEnter'),
    onDropExit: action('OnDropExit')
  };
}

export const DropzoneExampleWithFileTriggerLink: StoryFn<typeof VueDropZone> = () => ({
  components: {
    VueDropZone,
    VueFileTrigger
  },
  setup() {
    let actions = useDropActions();
    return {
      actions,
      onSelect: action('onSelect')
    };
  },
  template: `
    <div>
      <VueDropZone
        label="Drop files here"
        @files-drop="actions.onDrop" />
      <VueFileTrigger @select="onSelect">
        <span style="text-decoration: underline; cursor: pointer;">Upload</span>
      </VueFileTrigger>
    </div>
  `
});

export const DropzoneExampleWithFileTriggerButton: StoryFn<typeof VueDropZone> = () => ({
  components: {
    VueDropZone,
    VueFileTrigger
  },
  setup() {
    let actions = useDropActions();
    return {
      actions,
      onSelect: action('onSelect')
    };
  },
  template: `
    <div>
      <VueDropZone
        label="Drop files here"
        @files-drop="actions.onDrop" />
      <VueFileTrigger @select="onSelect">Upload</VueFileTrigger>
    </div>
  `
});

export const DropzoneExampleWithDraggableAndFileTrigger: StoryFn<typeof VueDropZone> = () => ({
  components: {
    VueDropZone,
    VueFileTrigger
  },
  setup() {
    let actions = useDropActions();
    return {
      actions,
      onSelect: action('onSelect')
    };
  },
  template: `
    <div>
      <div style="margin-bottom: 8px; border: 1px dashed #666; padding: 6px; width: fit-content;">Drag me</div>
      <VueDropZone
        label="Or drag into here"
        @files-drop="actions.onDrop"
        @text-drop="actions.onDrop" />
      <VueFileTrigger @select="onSelect">Browse</VueFileTrigger>
    </div>
  `
});

export const DropZoneOnlyAcceptPNGWithFileTrigger: StoryFn<typeof VueDropZone> = () => ({
  template: `
    <div>
      <div style="border: 2px solid white; margin: 20px; padding: 20px; outline: none;">
        <button type="button">Upload</button>
      </div>
    </div>
  `
});

export const DropZoneWithCaptureMobileOnly: StoryFn<typeof VueDropZone> = () => ({
  components: {
    VueDropZone,
    VueFileTrigger
  },
  setup() {
    let actions = useDropActions();
    return {
      actions,
      onSelect: action('onSelect')
    };
  },
  template: `
    <div>
      <VueDropZone
        label="Capture image"
        accept="image/png"
        @files-drop="actions.onDrop" />
      <VueFileTrigger default-camera="environment" @select="onSelect">Upload</VueFileTrigger>
    </div>
  `
});

export const DropzoneExampleWithDraggableObject: StoryFn<typeof VueDropZone> = () => ({
  components: {
    VueDropZone
  },
  setup() {
    let actions = useDropActions();
    return {
      actions
    };
  },
  template: `
    <div>
      <div style="margin-bottom: 8px; border: 1px dashed #666; padding: 6px; width: fit-content;">Drag me</div>
      <VueDropZone
        label="DropZone Area"
        @files-drop="actions.onDrop"
        @text-drop="actions.onDrop" />
    </div>
  `
});

export const DropzoneExampleWithCopyableObject: StoryFn<typeof VueDropZone> = () => ({
  components: {
    VueDropZone
  },
  setup() {
    let actions = useDropActions();
    return {
      actions
    };
  },
  template: `
    <div>
      <div style="margin-bottom: 8px; border: 1px dashed #666; padding: 6px; width: fit-content;">Copy me</div>
      <VueDropZone
        label="DropZone Area"
        @files-drop="actions.onDrop"
        @text-drop="actions.onDrop" />
    </div>
  `
});

export const DropzoneWithRenderProps: Story = {
  args: {
    isDisabled: false
  },
  argTypes: {
    isDisabled: {control: 'boolean'}
  },
  render: (args: {isDisabled?: boolean}) => ({
    components: {
      VueDropZone
    },
    setup() {
      let isFocused = ref(false);
      let isHovered = ref(false);
      let isDropTarget = ref(false);
      let actions = useDropActions();
      return {
        actions,
        args,
        isDropTarget,
        isFocused,
        isHovered
      };
    },
    template: `
      <div>
        <VueDropZone
          :disabled="args.isDisabled ?? false"
          label="DropzoneArea"
          @focus="isFocused = true"
          @blur="isFocused = false"
          @files-drop="actions.onDrop" />
        <div>isHovered: {{ isHovered ? 'true' : 'false' }}</div>
        <div>isFocused: {{ isFocused ? 'true' : 'false' }}</div>
        <div>isFocusVisible: {{ isFocused ? 'true' : 'false' }}</div>
        <div>isDropTarget: {{ isDropTarget ? 'true' : 'false' }}</div>
        <div>isDisabled: {{ (args.isDisabled ?? false) ? 'true' : 'false' }}</div>
      </div>
    `
  })
};
