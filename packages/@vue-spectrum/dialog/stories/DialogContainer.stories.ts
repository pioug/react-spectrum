import {DialogContainer} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof DialogContainer> = {
  title: 'DialogContainer',
  component: DialogContainer,
  args: {
    title: 'Example dialog'
  },
  argTypes: {
    dismissable: {
      control: 'boolean'
    },
    isDismissable: {
      control: 'boolean'
    },
    isHidden: {
      control: 'boolean'
    },
    isOpen: {
      control: 'boolean'
    },
    onDismiss: {
      table: {
        disable: true
      }
    },
    open: {
      control: 'boolean'
    },
    role: {
      control: 'text'
    },
    size: {
      control: 'select',
      options: [
        'S',
        'M',
        'L',
        'fullscreen',
        'fullscreenTakeover'
      ]
    },
    title: {
      control: 'text'
    },
    type: {
      control: 'select',
      options: [
        'modal',
        'popover',
        'tray',
        'fullscreen',
        'fullscreenTakeover'
      ]
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {DialogContainer},
    setup() {
      return {args};
    },
    template: '<DialogContainer v-bind="args">Dialog content</DialogContainer>'
  })
};

export const InAMenu: Story = {
  ...Default,
  render: (args) => ({
    components: {DialogContainer},
    setup() {
      return {args};
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <div>Menu trigger parity scenario</div>
        <DialogContainer v-bind="args">Dialog content from menu</DialogContainer>
      </div>
    `
  })
};

export const TypeFullscreen: Story = {
  ...Default,
  args: {
    type: 'fullscreen'
  }
};

export const TypeFullscreenTakeover: Story = {
  ...Default,
  args: {
    type: 'fullscreenTakeover'
  }
};

export const IsDismissable: Story = {
  ...Default,
  args: {
    isDismissable: true
  }
};

export const IsKeyboardDismissDisabled: Story = {
  ...Default,
  args: {
    isKeyboardDismissDisabled: true
  }
};

export const NestedDialogContainers: Story = {
  render: (args) => ({
    components: {DialogContainer},
    setup() {
      return {args};
    },
    template: `
      <DialogContainer v-bind="args">
        Outer dialog content
        <DialogContainer title="Nested dialog">Nested dialog content</DialogContainer>
      </DialogContainer>
    `
  })
};
