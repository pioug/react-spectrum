import {DropZone} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof DropZone> = {
  title: 'DnD/DropZone',
  component: DropZone,
  args: {
    disabled: false,
    label: 'Drop files here',
    multiple: true
  },
  argTypes: {
    accept: {
      control: 'text'
    },
    disabled: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    multiple: {
      control: 'boolean'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {DropZone},
    setup() {
      return {args};
    },
    template: '<DropZone v-bind="args" />'
  })
};

export const DisabledState: Story = {
  ...Default,
  args: {
    disabled: true
  }
};

export const SingleFile: Story = {
  ...Default,
  args: {
    label: 'Drop a single file',
    multiple: false
  }
};

export const AcceptImages: Story = {
  ...Default,
  args: {
    accept: 'image/*',
    label: 'Drop image files'
  }
};
