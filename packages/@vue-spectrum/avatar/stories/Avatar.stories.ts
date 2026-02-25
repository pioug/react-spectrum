import {Avatar} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof Avatar> = {
  title: 'Avatar',
  component: Avatar,
  args: {
    label: 'Example'
  },
  argTypes: {
    alt: {
      control: 'text'
    },
    isDisabled: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    shape: {
      control: 'text'
    },
    size: {
      control: 'text'
    },
    src: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Avatar},
    setup() {
      return {args};
    },
    template: '<Avatar v-bind="args">Example</Avatar>'
  })
};

export const Disabled: Story = {
  ...Default,
  args: {
    isDisabled: true
  }
};
