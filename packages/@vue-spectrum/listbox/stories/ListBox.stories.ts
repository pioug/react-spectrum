import {ListBox} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof ListBox> = {
  title: 'ListBox',
  component: ListBox,
  args: {
    label: 'Example'
  },
  argTypes: {
    ariaLabel: {
      control: 'text'
    },
    isDisabled: {
      control: 'boolean'
    },
    items: {
      table: {
        disable: true
      }
    },
    label: {
      control: 'text'
    },
    selectionMode: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {ListBox},
    setup() {
      return {args};
    },
    template: '<ListBox v-bind="args">Example</ListBox>'
  })
};

export const Disabled: Story = {
  ...Default,
  args: {
    isDisabled: true
  }
};

export const CustomLabel: Story = {
  ...Default,
  args: {
    label: 'Select an option'
  }
};

export const AlternateLabel: Story = {
  ...Default,
  args: {
    label: 'Choose category'
  }
};
