import {ColorSwatch, parseColor} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof ColorSwatch> = {
  title: 'ColorThumb',
  component: ColorSwatch,
  argTypes: {
    color: {
      table: {
        disable: true
      }
    },
    isDisabled: {
      control: 'boolean'
    },
    isDragging: {
      control: 'boolean'
    },
    isFocused: {
      control: 'boolean'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    color: parseColor('#f00')
  },
  render: (args) => ({
    components: {ColorSwatch},
    setup() {
      return {args};
    },
    template: '<ColorSwatch v-bind="args" label="Color thumb" />'
  })
};

export const Alpha: Story = {
  ...Default,
  args: {
    color: parseColor('hsla(0, 100%, 100%, 0)')
  }
};
