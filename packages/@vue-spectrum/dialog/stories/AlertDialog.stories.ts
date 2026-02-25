import {AlertDialog} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof AlertDialog> = {
  title: 'Dialog/Alert',
  component: AlertDialog,
  argTypes: {
    autoFocusButton: {
      control: 'text'
    },
    cancelLabel: {
      control: 'text'
    },
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
    isPrimaryActionDisabled: {
      control: 'boolean'
    },
    isSecondaryActionDisabled: {
      control: 'boolean'
    },
    onCancel: {
      table: {
        disable: true
      }
    },
    onClose: {
      table: {
        disable: true
      }
    },
    onPrimaryAction: {
      table: {
        disable: true
      }
    },
    onSecondaryAction: {
      table: {
        disable: true
      }
    },
    open: {
      control: 'boolean'
    },
    primaryActionLabel: {
      control: 'text'
    },
    secondaryActionLabel: {
      control: 'text'
    },
    title: {
      control: 'text'
    },
    variant: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {AlertDialog},
    setup() {
      return {args};
    },
    template: '<AlertDialog v-bind="args">Example</AlertDialog>'
  })
};

export const CustomTitle: Story = {
  ...Default,
  args: {
    title: 'Story variant'
  }
};

export const Open: Story = {
  ...Default,
  args: {
    isOpen: true
  }
};
