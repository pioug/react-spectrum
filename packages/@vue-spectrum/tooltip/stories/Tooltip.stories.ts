import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Tooltip} from '../src';

const meta: Meta<typeof Tooltip> = {
  title: 'Tooltip',
  component: Tooltip,
  args: {
    isOpen: true,
    children: 'This is a tooltip'
  },
  argTypes: {
    placement: {
      control: 'radio',
      options: ['top', 'bottom', 'left', 'right']
    },
    variant: {
      control: 'radio',
      options: [undefined, 'neutral', 'info', 'positive', 'negative']
    },
    showIcon: {
      control: 'boolean'
    },
    isOpen: {
      control: {disable: true}
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Tooltip},
    setup() {
      return {args};
    },
    template: '<Tooltip v-bind="args">{{ args.children }}</Tooltip>'
  })
};

export const LongContent: Story = {
  args: {
    children: `
      Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
      Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero
      sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.
      Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed,
      commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros
      ipsum rutrum orci, sagittis tempus lacus enim ac dui.
    `
  }
};
