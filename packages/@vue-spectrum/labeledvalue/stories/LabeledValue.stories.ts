import {LabeledValue} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof LabeledValue> = {
  title: 'LabeledValue',
  component: LabeledValue,
  args: {
    label: 'Storage',
    value: '128 GB',
    orientation: 'vertical'
  },
  argTypes: {
    elementType: {
      control: 'text'
    },
    emptyValue: {
      control: 'text'
    },
    formatOptions: {
      table: {
        disable: true
      }
    },
    label: {
      control: 'text'
    },
    locale: {
      control: 'text'
    },
    orientation: {
      control: 'select',
      options: [
        'vertical',
        'horizontal'
      ]
    },
    value: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {LabeledValue},
    setup() {
      return {args};
    },
    template: '<LabeledValue v-bind="args"></LabeledValue>'
  })
};

export const Horizontal: Story = {
  ...Default,
  args: {
    orientation: 'horizontal'
  }
};

export const NumericValue: Story = {
  ...Default,
  args: {
    label: 'Users',
    value: 1520
  }
};

export const EmptyState: Story = {
  ...Default,
  args: {
    value: '',
    emptyValue: 'Not set'
  }
};
