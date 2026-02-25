import {ColorArea} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof ColorArea> = {
  title: 'ColorArea',
  component: ColorArea,
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
      table: {
        disable: true
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {ColorArea},
    setup() {
      return {args};
    },
    template: '<ColorArea v-bind="args">Example</ColorArea>'
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
    label: 'Color area'
  }
};

export const DisabledProp: Story = {
  ...Default,
  args: {
    disabled: true
  }
};
