import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Table} from '../src';

const meta: Meta<typeof Table> = {
  title: 'TableView',
  component: Table,
  args: {
    ariaLabel: 'Example'
  },
  argTypes: {
    ariaLabel: {
      control: 'text'
    },
    ariaLabelledby: {
      control: 'text'
    },
    caption: {
      control: 'text'
    },
    columns: {
      table: {
        disable: true
      }
    },
    dataTestid: {
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
    openKeys: {
      table: {
        disable: true
      }
    },
    overflowMode: {
      control: 'select',
      options: ['truncate', 'wrap']
    },
    resizableColumns: {
      table: {
        disable: true
      }
    },
    rowKey: {
      control: 'text'
    },
    rows: {
      table: {
        disable: true
      }
    },
    selectionMode: {
      control: 'text'
    },
    sortDescriptor: {
      table: {
        disable: true
      }
    },
    visibility: {
      control: 'select',
      options: ['hidden', 'visible']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Table},
    setup() {
      return {args};
    },
    template: '<Table v-bind="args">Example</Table>'
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
