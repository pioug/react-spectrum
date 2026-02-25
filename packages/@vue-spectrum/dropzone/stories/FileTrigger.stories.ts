import {DropZone} from '../src';
import {FileTrigger} from '@vue-spectrum/filetrigger';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof DropZone> = {
  title: 'DropZone/FileTrigger',
  component: DropZone,
  args: {
    accept: 'image/*',
    acceptedFileTypes: ['image/png', 'image/jpeg'],
    disabled: false,
    label: 'Upload files',
    multiple: true
  },
  argTypes: {
    accept: {
      control: 'text'
    },
    acceptedFileTypes: {
      control: 'object'
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
    components: {DropZone, FileTrigger},
    setup() {
      return {args};
    },
    template: `
      <div style="display: grid; gap: 12px; max-width: 360px;">
        <DropZone
          :accept="args.accept"
          :disabled="args.disabled"
          :label="args.label"
          :multiple="args.multiple" />
        <FileTrigger
          :accepted-file-types="args.acceptedFileTypes"
          :allows-multiple="args.multiple"
          :disabled="args.disabled">
          Browse files
        </FileTrigger>
      </div>
    `
  })
};

export const SingleFile: Story = {
  ...Default,
  args: {
    multiple: false
  }
};

export const DisabledState: Story = {
  ...Default,
  args: {
    disabled: true
  }
};

export const DocumentFiles: Story = {
  ...Default,
  args: {
    accept: '.pdf,.doc,.docx',
    acceptedFileTypes: ['.pdf', '.doc', '.docx'],
    label: 'Upload documents'
  }
};
