import {ContextualHelp} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof ContextualHelp> = {
  title: 'ContextualHelp',
  component: ContextualHelp,
  args: {
    label: 'Example'
  },
  argTypes: {
    disabled: {
      control: 'boolean'
    },
    dismissable: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    modelValue: {
      control: 'boolean'
    },
    placement: {
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
    components: {ContextualHelp},
    setup() {
      return {args};
    },
    template: '<ContextualHelp v-bind="args">Example</ContextualHelp>'
  })
};

export const CustomLabel: Story = {
  ...Default,
  args: {
    label: 'Story variant'
  }
};

export const Disabled: Story = {
  ...Default,
  args: {
    disabled: true
  }
};
