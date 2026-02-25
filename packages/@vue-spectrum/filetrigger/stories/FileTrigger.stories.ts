import {FileTrigger} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof FileTrigger> = {
  title: 'FileTrigger',
  component: FileTrigger,
  args: {
    disabled: false
  },
  argTypes: {
    accept: {
      control: 'text'
    },
    acceptedFileTypes: {
      control: 'object'
    },
    acceptDirectory: {
      control: 'boolean'
    },
    allowsMultiple: {
      control: 'boolean'
    },
    defaultCamera: {
      control: 'radio',
      options: ['user', 'environment']
    },
    disabled: {
      control: 'boolean'
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
    components: {FileTrigger},
    setup() {
      return {args};
    },
    template: '<FileTrigger v-bind="args">Select files</FileTrigger>'
  })
};

export const AllowsMultiple: Story = {
  ...Default,
  args: {
    allowsMultiple: true
  }
};

export const AcceptedImages: Story = {
  ...Default,
  args: {
    acceptedFileTypes: ['image/png', 'image/jpeg']
  }
};

export const DirectorySelection: Story = {
  ...Default,
  args: {
    acceptDirectory: true
  }
};
