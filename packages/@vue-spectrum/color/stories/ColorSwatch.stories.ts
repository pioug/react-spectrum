import {ColorSwatch} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof ColorSwatch> = {
  title: 'ColorSwatch',
  component: ColorSwatch,
  argTypes: {
    color: {
      control: 'color'
    },
    rounding: {
      control: 'radio',
      options: ['default', 'none', 'full']
    },
    size: {
      control: 'radio',
      options: ['XS', 'S', 'M', 'L']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    color: 'rgb(255, 0, 0)'
  },
  render: (args) => ({
    components: {ColorSwatch},
    setup() {
      return {args};
    },
    template: '<ColorSwatch v-bind="args" />'
  })
};

export const NoValue: Story = {
  render: (args) => ({
    components: {ColorSwatch},
    setup() {
      return {args};
    },
    template: '<ColorSwatch v-bind="args" />'
  })
};

export const CustomWidth: Story = {
  render: (args) => ({
    components: {ColorSwatch},
    setup() {
      return {args};
    },
    template: '<ColorSwatch v-bind="args" style="width: 96px; height: 24px;" />'
  }),
  args: {
    ...Default.args
  }
};
