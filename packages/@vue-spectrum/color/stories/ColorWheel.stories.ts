import {ColorWheel} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof ColorWheel> = {
  title: 'ColorWheel',
  component: ColorWheel,
  args: {
    label: 'Example'
  },
  argTypes: {
    disabled: {
      control: 'boolean'
    },
    isDisabled: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    modelValue: {
      control: 'number'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {ColorWheel},
    setup() {
      return {args};
    },
    template: '<ColorWheel v-bind="args">Example</ColorWheel>'
  })
};

export const Disabled: Story = {
  ...Default,
  args: {
    isDisabled: true
  }
};

export const CustomLabel: Story = {
  ...Default,
  args: {
    label: 'Color wheel'
  }
};
