import {action} from '@storybook/addon-actions';
import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VueDropZone, VueFileTrigger} from 'vue-aria-components';
import '../../react-aria-components/example/index.css';
import '../../react-aria-components/stories/styles.css';

const meta = {
  title: 'React Aria Components/Dropzone',
  component: VueDropZone
} satisfies Meta<typeof VueDropZone>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DropzoneExampleWithFileTriggerLink: StoryFn<typeof VueDropZone> = (args) => ({
  components: {
    VueDropZone,
    VueFileTrigger
  },
  setup() {
    return {
      args,
      onDrop: action('OnDrop'),
      onDropEnter: action('OnDropEnter'),
      onDropExit: action('OnDropExit'),
      onSelect: action('onSelect')
    };
  },
  template: `
    <div>
      <VueDropZone
        v-bind="args"
        aria-label="testing aria-label"
        class="dropzone"
        data-testid="drop-zone-example-with-file-trigger-link"
        @drop="onDrop"
        @drop-enter="onDropEnter"
        @drop-exit="onDropExit">
        <VueFileTrigger @select="onSelect">
          <a class="react-aria-Link" data-rac="" tabindex="0" role="link">Upload</a>
        </VueFileTrigger>
      </VueDropZone>
    </div>
  `
});

export const DropzoneExampleWithFileTriggerButton: StoryFn<typeof VueDropZone> = (args) => ({
  components: {
    VueDropZone,
    VueFileTrigger
  },
  setup() {
    return {
      args,
      onDrop: action('OnDrop'),
      onDropEnter: action('OnDropEnter'),
      onDropExit: action('OnDropExit'),
      onSelect: action('onSelect')
    };
  },
  template: `
    <div>
      <VueDropZone
        v-bind="args"
        class="dropzone"
        @drop="onDrop"
        @drop-enter="onDropEnter"
        @drop-exit="onDropExit">
        <VueFileTrigger @select="onSelect">
          <button class="react-aria-Button" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true">Upload</button>
        </VueFileTrigger>
      </VueDropZone>
    </div>
  `
});

export const DropzoneExampleWithDraggableAndFileTrigger: StoryFn<typeof VueDropZone> = (args) => ({
  components: {
    VueDropZone,
    VueFileTrigger
  },
  setup() {
    return {
      args,
      onDrop: action('OnDrop'),
      onDropEnter: action('OnDropEnter'),
      onDropExit: action('OnDropExit'),
      onSelect: action('onSelect')
    };
  },
  template: `
    <div>
      <div role="button" tabindex="0" draggable="true" class="draggable">Drag me</div>
      <VueDropZone
        v-bind="args"
        class="dropzone"
        @drop="onDrop"
        @drop-enter="onDropEnter"
        @drop-exit="onDropExit">
        <VueFileTrigger @select="onSelect">
          <button class="react-aria-Button" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true">Browse</button>
        </VueFileTrigger>
        Or drag into here
      </VueDropZone>
    </div>
  `
});

export const DropZoneOnlyAcceptPNGWithFileTrigger: StoryFn<typeof VueDropZone> = (args) => ({
  components: {
    VueDropZone,
    VueFileTrigger
  },
  setup() {
    return {
      args,
      onDrop: action('OnDrop'),
      onDropEnter: action('OnDropEnter'),
      onDropExit: action('OnDropExit'),
      onSelect: action('onSelect'),
      pngDropOperation(types: Set<string>) {
        return types.has('image/png') ? 'copy' : 'cancel';
      }
    };
  },
  template: `
    <div>
      <VueDropZone
        v-bind="args"
        :get-drop-operation="pngDropOperation"
        class="dropzone"
        @drop="onDrop"
        @drop-enter="onDropEnter"
        @drop-exit="onDropExit">
        <VueFileTrigger :accepted-file-types="['image/png']" @select="onSelect">
          <button class="react-aria-Button" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true">Upload</button>
        </VueFileTrigger>
      </VueDropZone>
    </div>
  `
});

export const DropZoneWithCaptureMobileOnly: StoryFn<typeof VueDropZone> = (args) => ({
  components: {
    VueDropZone,
    VueFileTrigger
  },
  setup() {
    return {
      args,
      onDrop: action('OnDrop'),
      onDropEnter: action('OnDropEnter'),
      onDropExit: action('OnDropExit'),
      onSelect: action('onSelect'),
      pngDropOperation(types: Set<string>) {
        return types.has('image/png') ? 'copy' : 'cancel';
      }
    };
  },
  template: `
    <div>
      <VueDropZone
        v-bind="args"
        :get-drop-operation="pngDropOperation"
        class="dropzone"
        @drop="onDrop"
        @drop-enter="onDropEnter"
        @drop-exit="onDropExit">
        <VueFileTrigger default-camera="environment" @select="onSelect">
          <button class="react-aria-Button" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true">Upload</button>
        </VueFileTrigger>
      </VueDropZone>
    </div>
  `
});

export const DropzoneExampleWithDraggableObject: StoryFn<typeof VueDropZone> = (args) => ({
  components: {
    VueDropZone
  },
  setup() {
    return {
      args,
      onDrop: action('OnDrop'),
      onDropEnter: action('OnDropEnter'),
      onDropExit: action('OnDropExit')
    };
  },
  template: `
    <div>
      <div role="button" tabindex="0" draggable="true" class="draggable">Drag me</div>
      <VueDropZone
        v-bind="args"
        class="dropzone"
        @drop="onDrop"
        @drop-enter="onDropEnter"
        @drop-exit="onDropExit">
        <span class="react-aria-Text">DropZone Area</span>
      </VueDropZone>
    </div>
  `
});

export const DropzoneExampleWithCopyableObject: StoryFn<typeof VueDropZone> = (args) => ({
  components: {
    VueDropZone
  },
  setup() {
    return {
      args,
      onDrop: action('OnDrop'),
      onDropEnter: action('OnDropEnter'),
      onDropExit: action('OnDropExit')
    };
  },
  template: `
    <div>
      <div role="textbox" aria-label="copyable element" tabindex="0" class="copyable">Copy me</div>
      <VueDropZone
        v-bind="args"
        class="dropzone"
        @drop="onDrop"
        @drop-enter="onDropEnter"
        @drop-exit="onDropExit">
        <span class="react-aria-Text">DropZone Area</span>
      </VueDropZone>
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
      return {
        args,
        onDrop: action('OnDrop'),
        onDropEnter: action('OnDropEnter'),
        onDropExit: action('OnDropExit'),
        onPress: action('OnPress')
      };
    },
    template: `
      <div>
        <div role="button" tabindex="0" draggable="true" class="draggable">Drag me</div>
        <div role="textbox" aria-label="copyable element" tabindex="0" class="copyable">Copy me</div>
        <VueDropZone
          class="dropzone"
          :is-disabled="args.isDisabled ?? false"
          @press="onPress"
          @drop="onDrop"
          @drop-enter="onDropEnter"
          @drop-exit="onDropExit"
          v-slot="{isHovered, isFocused, isFocusVisible, isDropTarget, isDisabled}">
          <div>
            <span class="react-aria-Text">DropzoneArea</span>
            <div>isHovered: {{ isHovered ? 'true' : 'false' }}</div>
            <div>isFocused: {{ isFocused ? 'true' : 'false' }}</div>
            <div>isFocusVisible: {{ isFocusVisible ? 'true' : 'false' }}</div>
            <div>isDropTarget: {{ isDropTarget ? 'true' : 'false' }}</div>
            <div>isDisabled: {{ isDisabled ? 'true' : 'false' }}</div>
          </div>
        </VueDropZone>
      </div>
    `
  })
};
