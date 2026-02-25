import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Modal} from '../src';

const meta: Meta<typeof Modal> = {
  title: 'Modal',
  component: Modal,
  argTypes: {
    dismissable: {
      control: 'boolean'
    },
    isDismissable: {
      control: 'boolean'
    },
    isOpen: {
      control: 'boolean'
    },
    onEnter: {
      table: {
        disable: true
      }
    },
    onEntered: {
      table: {
        disable: true
      }
    },
    onEntering: {
      table: {
        disable: true
      }
    },
    onExit: {
      table: {
        disable: true
      }
    },
    onExited: {
      table: {
        disable: true
      }
    },
    onExiting: {
      table: {
        disable: true
      }
    },
    open: {
      control: 'boolean'
    },
    state: {
      table: {
        disable: true
      }
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
    components: {Modal},
    setup() {
      return {args};
    },
    template: '<Modal v-bind="args">Example</Modal>'
  })
};

export const Dismissable: Story = {
  ...Default,
  args: {
    dismissable: true
  }
};

export const Open: Story = {
  ...Default,
  args: {
    isOpen: true
  }
};

export const NonDismissable: Story = {
  ...Default,
  args: {
    isDismissable: false
  }
};
