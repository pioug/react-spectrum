import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Meter} from '../src';

const meta: Meta<typeof Meter> = {
  title: 'Meter',
  component: Meter,
  args: {
    label: 'Example'
  },
  argTypes: {
    label: {
      control: 'text'
    },
    max: {
      control: 'number'
    },
    min: {
      control: 'number'
    },
    showValueLabel: {
      control: 'boolean'
    },
    value: {
      control: 'number'
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
    components: {Meter},
    setup() {
      return {args};
    },
    template: '<Meter v-bind="args">Example</Meter>'
  })
};

export const CustomLabel: Story = {
  ...Default,
  args: {
    label: 'Story variant'
  }
};

export const ValueLabel: Story = {
  ...Default,
  args: {
    showValueLabel: true,
    value: 75
  }
};
