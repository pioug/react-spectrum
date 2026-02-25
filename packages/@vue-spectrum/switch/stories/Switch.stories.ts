import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Switch} from '../src';

const meta: Meta<typeof Switch> = {
  title: 'Switch',
  component: Switch,
  args: {
    label: 'Example'
  },
  argTypes: {
    autoFocus: {
      control: 'boolean'
    },
    disabled: {
      control: 'boolean'
    },
    isDisabled: {
      control: 'boolean'
    },
    isEmphasized: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    modelValue: {
      control: 'boolean'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Switch},
    setup() {
      return {args};
    },
    template: '<Switch v-bind="args">Example</Switch>'
  })
};

export const Disabled: Story = {
  ...Default,
  args: {
    isDisabled: true
  }
};

export const Emphasized: Story = {
  ...Default,
  args: {
    isEmphasized: true
  }
};

export const DisabledProp: Story = {
  ...Default,
  args: {
    disabled: true
  }
};
