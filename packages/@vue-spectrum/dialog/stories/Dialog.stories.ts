import {Dialog} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof Dialog> = {
  title: 'Dialog',
  component: Dialog,
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
      control: 'text'
    },
    title: {
      control: 'text'
    },
    type: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Dialog},
    setup() {
      return {args};
    },
    template: '<Dialog v-bind="args">Example</Dialog>'
  })
};

export const CustomTitle: Story = {
  ...Default,
  args: {
    title: 'Review changes'
  }
};

export const Open: Story = {
  ...Default,
  args: {
    isOpen: true
  }
};

export const AlternateTitle: Story = {
  ...Default,
  args: {
    title: 'Review request'
  }
};
