import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {StepList} from '../src';

const meta: Meta<typeof StepList> = {
  title: 'StepList',
  component: StepList,
  args: {
    ariaLabel: 'Checkout steps',
    items: [
      {
        key: 'plan',
        label: 'Plan'
      },
      {
        key: 'review',
        label: 'Review'
      },
      {
        key: 'ship',
        label: 'Ship'
      }
    ],
    modelValue: 'plan',
    orientation: 'horizontal'
  },
  argTypes: {
    ariaLabel: {
      control: 'text'
    },
    disabledKeys: {
      table: {
        disable: true
      }
    },
    items: {
      table: {
        disable: true
      }
    },
    modelValue: {
      control: 'text'
    },
    orientation: {
      control: 'select',
      options: [
        'horizontal',
        'vertical'
      ]
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {StepList},
    setup() {
      return {args};
    },
    template: '<StepList v-bind="args"></StepList>'
  })
};

export const Vertical: Story = {
  ...Default,
  args: {
    orientation: 'vertical'
  }
};

export const WithDisabledStep: Story = {
  ...Default,
  args: {
    disabledKeys: [
      'review'
    ]
  }
};

export const ReviewSelected: Story = {
  ...Default,
  args: {
    modelValue: 'review'
  }
};
