import {ListView} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof ListView> = {
  title: 'ListView',
  component: ListView,
  args: {
    label: 'Example'
  },
  argTypes: {
    ariaLabel: {
      control: 'text'
    },
    density: {
      control: 'select',
      options: ['compact', 'regular', 'spacious']
    },
    isDisabled: {
      control: 'boolean'
    },
    isQuiet: {
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
    loadingState: {
      control: 'select',
      options: ['idle', 'loading', 'loadingMore']
    },
    selectionMode: {
      control: 'text'
    },
    selectionStyle: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {ListView},
    setup() {
      return {args};
    },
    template: '<ListView v-bind="args">Example</ListView>'
  })
};

export const Disabled: Story = {
  ...Default,
  args: {
    isDisabled: true
  }
};

export const Quiet: Story = {
  ...Default,
  args: {
    isQuiet: true
  }
};

export const Compact: Story = {
  ...Default,
  args: {
    density: 'compact'
  }
};
