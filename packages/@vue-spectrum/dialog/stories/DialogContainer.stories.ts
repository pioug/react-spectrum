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

export const NonDismissable: Story = {
  ...Default,
  args: {
    isDismissable: false
  }
};

export const Popover: Story = {
  ...Default,
  args: {
    type: 'popover',
    size: 'S'
  }
};

export const Hidden: Story = {
  ...Default,
  args: {
    isHidden: true
  }
};
