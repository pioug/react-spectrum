import {DropZone} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof DropZone> = {
  title: 'DropZone',
  component: DropZone,
  args: {
    label: 'Example'
  },
  argTypes: {
    accept: {
      control: 'text'
    },
    disabled: {
      control: 'boolean'
    },
    isFilled: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    multiple: {
      control: 'boolean'
    },
    replaceMessage: {
      control: 'text'
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
    template: '<DropZone v-bind="args">Example</DropZone>'
  })
};

export const CustomLabel: Story = {
  ...Default,
  args: {
    label: 'Upload files'
  }
};

export const Disabled: Story = {
  ...Default,
  args: {
    disabled: true
  }
};

export const AlternateLabel: Story = {
  ...Default,
  args: {
    label: 'Alternate label'
  }
};
