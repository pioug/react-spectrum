import {ColorThumb, parseColor} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof ColorThumb> = {
  title: 'ColorThumb',
  component: ColorThumb,
  argTypes: {
    value: {
      table: {
        disable: true
      }
    },
    isFocused: {
      control: 'boolean'
    },
    isDragging: {
      control: 'boolean'
    },
    isDisabled: {
      control: 'boolean'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: parseColor('#f00')
  },
  render: (args) => ({
    components: {ColorThumb},
    setup() {
      return {args};
    },
    template: '<ColorThumb v-bind="args" />'
  })
};

export const Alpha: Story = {
  ...Default,
  args: {
    value: parseColor('hsla(0, 100%, 100%, 0)')
  }
};
