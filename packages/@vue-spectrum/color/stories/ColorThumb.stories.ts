import {ColorSwatch} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof ColorSwatch> = {
  title: 'ColorThumb',
  component: ColorSwatch,
  args: {
    label: 'Example'
  },
  argTypes: {
    bordered: {
      control: 'boolean'
    },
    color: {
      control: 'text'
    },
    isDisabled: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    selected: {
      control: 'boolean'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {ColorSwatch},
    setup() {
      return {args};
    },
    template: '<ColorSwatch v-bind="args">Example</ColorSwatch>'
  })
};

export const Disabled: Story = {
  ...Default,
  args: {
    isDisabled: true
  }
};
