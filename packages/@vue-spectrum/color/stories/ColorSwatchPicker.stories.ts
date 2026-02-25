import {ColorSwatchPicker} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof ColorSwatchPicker> = {
  title: 'ColorSwatchPicker',
  component: ColorSwatchPicker,
  argTypes: {
    disabled: {
      control: 'boolean'
    },
    isDisabled: {
      control: 'boolean'
    },
    items: {
      table: {
        disable: true
      }
    },
    modelValue: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {ColorSwatchPicker},
    setup() {
      return {args};
    },
    template: '<ColorSwatchPicker v-bind="args">Example</ColorSwatchPicker>'
  })
};

export const Disabled: Story = {
  ...Default,
  args: {
    isDisabled: true
  }
};

export const DisabledProp: Story = {
  ...Default,
  args: {
    disabled: true
  }
};

export const SelectedValue: Story = {
  ...Default,
  args: {
    modelValue: '#1473e6'
  }
};
