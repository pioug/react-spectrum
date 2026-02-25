import {InlineAlert} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof InlineAlert> = {
  title: 'InlineAlert',
  component: InlineAlert,
  args: {
    label: 'Example'
  },
  argTypes: {
    autoFocus: {
      control: 'boolean'
    },
    label: {
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
    components: {InlineAlert},
    setup() {
      return {args};
    },
    template: '<InlineAlert v-bind="args">Example</InlineAlert>'
  })
};

export const CustomLabel: Story = {
  ...Default,
  args: {
    label: 'Update available'
  }
};

export const CustomTitle: Story = {
  ...Default,
  args: {
    title: 'System notice'
  }
};

export const AlternateLabel: Story = {
  ...Default,
  args: {
    label: 'Maintenance notice'
  }
};
