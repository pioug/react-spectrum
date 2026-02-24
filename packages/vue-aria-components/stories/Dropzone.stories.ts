import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VueDropZone} from 'vue-aria-components';

const meta = {
  title: 'React Aria Components/Dropzone',
  component: VueDropZone
} satisfies Meta<typeof VueDropZone>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DropzoneExampleWithFileTriggerLink: StoryFn<typeof VueDropZone> = () => ({
  template: `
    <div>
      <div style="border: 2px solid white; margin: 20px; padding: 20px; outline: none;">
        <span class="react-aria-Link" data-rac="" tabindex="0" role="link">Upload</span>
      </div>
    </div>
  `
});

export const DropzoneExampleWithFileTriggerButton: StoryFn<typeof VueDropZone> = () => ({
  template: `
    <div>
      <div style="border: 2px solid white; margin: 20px; padding: 20px; outline: none;">
        <button type="button">Upload</button>
      </div>
    </div>
  `
});

export const DropzoneExampleWithDraggableAndFileTrigger: StoryFn<typeof VueDropZone> = () => ({
  template: `
    <div>
      <div role="button" tabindex="0" draggable="true">Drag me</div>
      <div style="border: 2px solid white; margin: 20px; padding: 20px; outline: none;">
        <button type="button">Browse</button>Or drag into here
      </div>
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
  template: `
    <div>
      <div style="border: 2px solid white; margin: 20px; padding: 20px; outline: none;">
        <button type="button">Upload</button>
      </div>
    </div>
  `
});

export const DropzoneExampleWithDraggableObject: StoryFn<typeof VueDropZone> = () => ({
  template: `
    <div>
      <div>Drag me</div>
      <div style="border: 2px solid white; margin: 20px; padding: 20px; outline: none;">
        DropZone Area
      </div>
    </div>
  `
});

export const DropzoneExampleWithCopyableObject: StoryFn<typeof VueDropZone> = () => ({
  template: `
    <div>
      <div role="textbox" aria-label="copyable element" tabindex="0">Copy me</div>
      <div style="border: 2px solid white; margin: 20px; padding: 20px; outline: none;">
        DropZone Area
      </div>
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
    setup() {
      return {
        args
      };
    },
    template: `
      <div>
        <div role="button" tabindex="0" draggable="true">Drag me</div>
        <div role="textbox" aria-label="copyable element" tabindex="0">Copy me</div>
        <div style="border: 2px solid white; margin: 20px; padding: 20px; outline: none;">
          <div>
            <span class="react-aria-Text" slot="label">DropzoneArea</span>
            <div>isHovered: false</div>
            <div>isFocused: false</div>
            <div>isFocusVisible: <span>false</span></div>
            <div>isDropTarget: false</div>
            <div>isDisabled: {{ (args.isDisabled ?? false) ? 'true' : 'false' }}</div>
          </div>
        </div>
      </div>
    `
  })
};
